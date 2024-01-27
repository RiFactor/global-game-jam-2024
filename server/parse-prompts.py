class Prompt:
  def __init__(self, word, prompt):
    self.word = word
    self.prompt = prompt

def ParsePrompts(filename) :
    """
    create a dictionary of difficulty to lists of prompts 
    """
    prompts = {}
    f = open(filename, 'r')
    for line in f:
        w, p= line.strip().split('-')
        prompt = {w.strip(), p.strip()}
        difficulty = len(w.strip())
        if difficulty not in prompts:
            prompts[difficulty] = []
        prompts[difficulty].append(prompt)
        
    return prompts

def GetRandomPromptOfDifficulty(prompts,difficulty):
    import random
    return random.choice(list(prompts[difficulty]))

# example retrieval of a random prompt of difficulty 3
print(f"Example of difficulty 3: {GetRandomPromptOfDifficulty(ParsePrompts('../assets/prompts.txt'), 3)}")