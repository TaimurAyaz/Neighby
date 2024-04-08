#!/bin/bash

indent_output() {
    # Run the command and redirect output to a temporary file
    temp_file=$(mktemp)
    "$@" > "$temp_file" 2>&1
    
    # Indent and display the output
    sed 's/^/    /' "$temp_file"
    
    # Remove the temporary file
    rm "$temp_file"
}

echo "\nStarting Neighby ... \n"

echo "Checking brew..."
if which brew > /dev/null
then
    echo "✅ brew is installed\n"
else
    echo "brew is installing..."
    indent_output /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo "✅ brew is installed\n"
fi

echo "Checking npm..."
if which npm > /dev/null
then
    echo "✅ npm is installed \n"
else
    echo "npm is installing..."
    indent_output brew install nvm
    mkdir ~/.nvm
    export NVM_DIR="$HOME/.nvm"
        [ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && . "$(brew --prefix)/opt/nvm/nvm.sh" # This loads nvm
        [ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && . "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" # This loads nvm bash_completion
    indent_output nvm install 21
    indent_output nvm use 21
    indent_output nvm list

    echo "✅ npm is installed \n"
fi

echo "Checking pm2..."
if which pm2 > /dev/null
then
    echo "✅ pm2 is installed \n"
else
    echo "pm2 is installing...\n"
    indent_output sudo npm install pm2@latest -g
    echo "✅ pm2 is installed \n"
fi

echo "Checking dependencies..."
indent_output sh ./utilities/check_npm_install.sh ./
indent_output sh ./utilities/check_npm_install.sh ./frontend
indent_output sh ./utilities/check_npm_install.sh ./services/mothership
echo "✅ all dependencies installed \n"

check_env() {
    echo "Checking env file..."
    if sh ./utilities/copy_env_if_needed.sh > /dev/null; then
        indent_output echo "✓ .env file is present."

        if sh ./utilities/check_env_is_empty.sh > /dev/null; then
            indent_output echo "✓ .env file is populated."
        else
            echo "❌ .env is empty. Please pull repo again."
            rm -rf .env
            exit 1
        fi

        unset_variables=$(sh ./utilities/check_env_variables.sh)

        # Check if there are unset variables
        if [ -z "$unset_variables" ]; then
            echo "✅ .env looks good  \n"
        else
            # echo "The following variables are requied in the .env file: ${unset_variables[*]}"
            sh ./utilities/update_env_with_values.sh ${unset_variables[*]}
            check_env
        fi

    else
        echo "❌ Failed to create .env file. Check if .env.example exists and you have proper permissions."
        rm -rf .env
        exit 1
    fi
}

check_env

echo "Starting stack..."
indent_output pm2 start pm2.config.yml 
indent_output pm2 save 

echo "\n✅ Neighby started at: http://localhost:$(sh ./utilities/get_port_value_from_env.sh .env frontend) ✨\n"

pm2 monit