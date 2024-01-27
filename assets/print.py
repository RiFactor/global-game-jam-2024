
from termcolor import colored

left = ["Q",  "W",  "E",  "R",  "T", "A",  "S",  "D",  "F", "G", "Z",  "X",  "C",  "V", "="    ]
right = ["Y",  "U",  "I",  "O",  "P",  "<",  "H",  "J",  "K",  "L", "B",  "N",  "M", "="]



def print_keyboard(player_number):
    if player_number % 2 == 0:
        enable = left
        disable = right
    else:
        enable = right
        disable = left

    with open("ascii/duck.txt") as f: 
        print (f.read())

    with open("ascii/keyboard.txt") as f:
        for line in f:  
            for ch in line: 
                
                if ch in enable:
                    print(colored(ch, 'green'), end='')
                
                elif ch in disable:
                    print(colored(ch, 'red'), end='')

                else:
                    print(ch, end='')

for player_number in [1,2]:
    print("Player:", player_number)
    print_keyboard(player_number)