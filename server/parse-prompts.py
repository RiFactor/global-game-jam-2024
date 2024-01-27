def ParsePrompts(filename) :
    """
    create a dictionary of difficulty to a list of dict{<string word>, <list of prompts>}
    """
    promptLookups = {}
    f = open(filename, 'r')
    for line in f:
        data = line.strip().split(',')
        promptLookup = {
            "word":data[0].strip(),
            "prompts": [x.strip() for x in data[1:]]
            }
        difficulty = len(data[0].strip())
        if difficulty not in promptLookups:
            promptLookups[difficulty] = []
        promptLookups[difficulty].append(promptLookup)
    return promptLookups

def GetRandomPromptOfDifficulty(promptLookups,difficulty):
    import random
    return random.choice(list(promptLookups[difficulty]))

# example retrieval of a random word and prompt/s of difficulty 3
print(f"Example of difficulty 3: {GetRandomPromptOfDifficulty(ParsePrompts('../assets/prompts.csv'), 3)}")
