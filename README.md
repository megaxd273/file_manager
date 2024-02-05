# file_manager

## overview

1. Start project with command: npm run start -- --username=your_username. Replace your_username with yours. Skipping username leads to working under 'Guest' name.
1. To exit the application, use ctrl+c or send the .exit command.
1. **Paths with whitespaces must be wrapped with double quotes**

## comands

- **up:** Go up from the current directory. (Doesn't change working directory if you are in the root folder.)
- **cd path_to_directory:** Go to a dedicated folder from the current directory. (Path can be relative or absolute.)
- **ls:** Print a list of all files and folders in the current directory.
- **cat path_to_file:** Read a file and print its content in the console.
- **add new_filename:** Create an empty file in the current working directory.
- **rn path_to_file new_filename:** Rename a file.
- **cp path_to_file path_to_new_directory:** Copy a file.
- **mv path_to_file path_to_new_directory:** Move a file.
- **rm path_to_file:** Remove a file.
- **os --EOL:** Get the default system End-Of-Line and print it to the console.
- **os --cpus:** Get host machine CPU information (overall amount of CPUs, plus model and clock rate in GHz for each) and print it to the console.
- **os --homedir:** Get the home directory and print it to the console.
- **os --username:** Get the current system username (not to be confused with the application's username) and print it to the console.
- **os --architecture:** Get the CPU architecture for which Node.js binary has compiled and print it to the console.
- **hash path_to_file:** Calculate the hash for a file and print it to the console.
- **compress path_to_file path_to_destination:** Compress a file using the Brotli algorithm.
- **decompress path_to_file path_to_destination:** Decompress a file using the Brotli algorithm.
