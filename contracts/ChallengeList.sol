contract ChallengeList {

    address[] public challenges;
    mapping (address => bool) public creators;

    function ChallengeList() {
        creators[msg.sender] = true;
    }

    function addCreator(address creator) {
        if (creators[msg.sender]) {
            creators[creator] = true;
        }
    }

    function addChallenge(address challenge) {
        if (creators[msg.sender]) {
            challenges[challenges.length] = challenge;
        }
    }
}
