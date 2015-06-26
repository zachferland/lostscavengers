contract Challenge {

    bytes32 public hash;
    bytes32 public title;
    bytes32 public hint;
    bytes32 public lat;
    bytes32 public lng;
    address owner;
    address public winner;

    function Challenge() {
        owner = msg.sender;
    }

    function setChallenge(bytes32 _hash, bytes32 _title, bytes32 _hint,
                            bytes32 _lat, bytes32 _lng) {
        if (msg.sender == owner) {
            hash = _hash;
            title = _title;
            hint = _hint;
            lat = _lat;
            lng = _lng;
        }
    }

    function check(bytes32 password) {
        var h = sha3(password);
        if (hash == h) {
            winner = msg.sender;
        }
    }
}
