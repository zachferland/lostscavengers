contract Challange {

    bytes32 public challangeHash;
    bytes32 public challangeHint;
    address owner;
    address public winner;
    bytes32 public test;

    function setChallange(bytes32 hash, bytes32 hint) {
        owner = msg.sender;
        challangeHint = hint;
        challangeHash = hash;
    }

    function check(bytes32 password) {
        if (challangeHash == sha3(password)) {
            winner = msg.sender;
        }
    }

    function gethash(bytes32 pw) {
        test = sha3(pw);
    }
}
