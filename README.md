![logo64](https://github.com/TaimurAyaz/Neighby/assets/7026217/4f9b1e71-4d2f-4694-8465-b4bec6ab957b)

## Neighby
Use AI to discover nearby places around any address in Toronto. 

### Requirements
- A valid `Groq` API Key. You can get this at https://groq.com
- A valid `Google Maps` API Key. You can get this at https://console.cloud.google.com/google/maps-apis/overview

### Setup
- Clone the repo
``` 
git clone git@github.com:TaimurAyaz/Neighby.git
```
- Open the directory
```
cd Neighby
```
- Run startup script
```
sh start.sh
```
This will install all the required dependencies, if needed. If this is the first time you are running **Neighby** you will be asked to provide the `Groq` and `Google Maps` API Keys. You can always modify these values in the generated `.env` file, later.


### Starting
If you followed the **Setup** above, you should aleady be up and running. 
You can manually start **Neighby** by calling the following in the cloned repository directory.
```
sh start.sh
```

### Stopping
You can stop **Neighby** by calling the following in the cloned repository directory.
```
sh stop.sh
```
