contract Challenge {

    bytes32 public challengeHash;
    bytes32 public challengeHint;
    address owner;
    address public winner;
    bytes32 public test;

    function setChallenge(bytes32 hash, bytes32 hint) {
        owner = msg.sender;
        challengeHint = hint;
        challengeHash = hash;
    }

    function check(bytes32 password) {
        if (challengeHash == sha3(password)) {
            winner = msg.sender;
        }
    }

    function gethash(bytes32 pw) {
        test = sha3(pw);
    }
}
