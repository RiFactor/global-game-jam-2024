
def parse_prompts(filename: str) -> list[tuple[str, list[str]]]:
    promptLookups: list[tuple[str, list[str]]] = []

    with open(filename, "r") as f:
        for line in f.readlines():
            data = line.strip().split("|")
            word = data[0].strip()
            prompts = [i.strip() for i in data[1:]]
            promptLookups.append((word, prompts))

    return promptLookups

