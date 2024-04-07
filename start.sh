#!/bin/bash

echo "\nStarting Neighby ... \n"

echo "Checking [brew] ..."
if which brew > /dev/null
then
    echo "✅ [brew] is installed \n"
else
    echo "[brew] is installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo "✅ [brew] is installed \n"
fi

echo "Checking [npm] ..."
if which npm > /dev/null
then
    echo "✅ [npm] is installed \n"
else
    echo "[npm] is installing..."
    brew install nvm
    mkdir ~/.nvm
    export NVM_DIR="$HOME/.nvm"
        [ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && . "$(brew --prefix)/opt/nvm/nvm.sh" # This loads nvm
        [ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && . "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" # This loads nvm bash_completion
    nvm install 21
    nvm use 21
    nvm list

    echo "✅ [npm] is installed \n"
fi

echo "Checking [pm2] ..."
if which pm2 > /dev/null
then
    echo "✅ [pm2] is installed \n"
else
    echo "[pm2] is installing..."
    sudo npm install pm2@latest -g
    echo "✅ [pm2] is installed \n"
fi

echo "Checking dependencies ..."
sh ./utilities/check_npm_install.sh ./
sh ./utilities/check_npm_install.sh ./frontend
sh ./utilities/check_npm_install.sh ./services/mothership
echo "✅ all dependencies installed \n"

echo "Starting stack ..."
pm2 start pm2.config.yml 

echo "\n✅ Neighby started at: http://localhost:$(sh ./utilities/get_port_value_from_env.sh .env frontend) ✨\n"

