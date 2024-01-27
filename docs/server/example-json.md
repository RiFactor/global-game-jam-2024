
# Example json Packets

## Team assignment (server to client)

```json
{
    "eventType": "teamAssignment",
    "data" : {
        "team" : 1,
        "userid" : 1231231
    }
}
```


## Client to server key press

```json
{
    "eventType": "keyPress",
    "data" : {
        "value" : "a"
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
