import hashlib
import sys
import time
import pyfiglet
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

# Banner
print(Fore.GREEN + pyfiglet.figlet_format("Hash Cracker"))

HASH_FUNCTIONS = {
    "MD5": hashlib.md5,
    "SHA1": hashlib.sha1,
    "SHA224": hashlib.sha224,
    "SHA256": hashlib.sha256,
    "SHA384": hashlib.sha384,
    "SHA512": hashlib.sha512
}

print(Fore.YELLOW + "Algorithms:" , Fore.YELLOW + Style.BRIGHT + " | "  .join(HASH_FUNCTIONS.keys()))

hash_type = input(Fore.CYAN + "Enter hash type: ").upper()
wordlist_path = input(Fore.CYAN + "Enter wordlist path: ")
target_hash = input(Fore.CYAN + "Enter hash: ").lower().strip()

if hash_type not in HASH_FUNCTIONS:
    print(Fore.RED + Style.BRIGHT + "[-] Invalid hash type")
    sys.exit()

hash_func = HASH_FUNCTIONS[hash_type]
attempts = 0
start_time = time.time()

try:
    with open(wordlist_path, "r", errors="ignore") as wordlist:
        for word in wordlist:
            word = word.strip()
            attempts += 1

            hashed = hash_func(word.encode()).hexdigest()

            if hashed == target_hash:
                print(Fore.GREEN + Style.BRIGHT + " \n[+] HASH CRACKED")
                print(Fore.GREEN +Style.BRIGHT + "[+] Password :", Style.BRIGHT + word)
                print(Fore.BLUE + "[+] Attempts :", attempts)
                print(Fore.MAGENTA + "[+] Time     : {:.2f} seconds".format(time.time() - start_time))
                sys.exit()

            if attempts % 100000 == 0:
                print(Fore.YELLOW + f"[*] Tried {attempts} passwords...", end="\r")

except FileNotFoundError:
    print(Fore.RED + Style.BRIGHT + "[-] Wordlist not found")
    sys.exit()

print(Fore.RED + Style.BRIGHT + "\n[-] Hash not found")
