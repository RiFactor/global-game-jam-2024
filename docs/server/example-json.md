
# Example json Packets

## Team assignment (server to client)

```json
{
    "eventType": "teamAssignment",
    "data" : {
        "team" : 1,
        "playernum": 1,
        "userid" : 1231231
    }
}
```


## Client to server key press

```json
{
    "eventType": "keyPress",
    "data" : {
        "value" : "a",
        "userid": 1231231
    }
}
```

## Server to client keys

```json
{
    "eventType": "keyBuffer",
    "data" : {
        "team": 1,
        "keys": [
            {
                "key": "a",
                "userid": 1231231,
            }
        ]
    }
}
```

## Server to client setup

```
{
    "eventType": "setup",
    "data" : {
        "bufferLayout": [3, 4],
    }
}
```

## Server to client next prompt

The `continued` flag indicates whether this should be added to the previous prompt. If it is 1, it is continued. If it is 0, it is a new prompt.

```
{
    "eventType": "prompt",
    "data" : {
        "continued": 1,
        "prompt": "This cat's gone wild"
    }
}
```

## Server to Client success

```json
{
    "eventType": "submissionState",
    "data" : {
        "submisison" : "<the-word-generated-by-the-clients>",
        "state" : "correct"
    }
}
```

## Server to Client failure

```json
{
    "eventType": "submissionState",
    "data" : {
        "submisison" : "<the-word-generated-by-the-clients>",
        "state" : "incorrect>"
    }
}
```
