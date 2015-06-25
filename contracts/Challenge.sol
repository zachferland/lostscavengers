contract Challenge {

    bytes32 public challengeHash;
    bytes32 public challengeHint;
    address owner;
    address public winner;

    function Challenge() {
        owner = msg.sender;
    }

    function setChallenge(bytes32 hash, bytes32 hint) {
        if (msg.sender == owner) {
            challengeHash = hash;
            challengeHint = hint;
        }
    }

    function check(bytes32 password) {
        var hash = sha3(password);
        if (challengeHash == hash) {
            winner = msg.sender;
        }
    }
}
