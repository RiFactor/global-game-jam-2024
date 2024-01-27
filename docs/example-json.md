
# Example json Packets


## Client to server key press

```json
{
    "eventType": "keyPress",
    "data" : {
        "value" : "a"
    }
}
```

## Server to Client successs
    
```json
{
    "eventType": "submissionState",
    "data" : {
        "submisison" : "correct",
        "state" : "<the state of the submission>"
    }
}
```

## Server to Client failure

```json
{
    "eventType": "submissionState",
    "data" : {
        "submisison" : "incorrect",
        "state" : "<the state of the submission>"
    }
}
```
