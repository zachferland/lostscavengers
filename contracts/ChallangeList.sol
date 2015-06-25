contract ChallangeList {

    address[] public challanges;
    mapping (address => bool) public creators;

    function ChallangeList() {
        creators[msg.sender] = true;
    }

    function addCreator(address creator) {
        if (creators[msg.sender]) {
            creators[creator] = true;
        }
    }

    function addChallange(address challange) {
        if (creators[msg.sender]) {
            challanges[challanges.length] = challange;
        }
    }
}
