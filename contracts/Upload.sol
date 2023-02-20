//SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

contract Upload{
    mapping(address=>string[]) uploaded_files_list;
    mapping(address=>mapping(string=>bool)) uploaded_files_map;
    mapping(address=>mapping(string=>bool)) uploaded_files_check_duplicate;
    mapping(address=>uint) uploaded_files_count;
    mapping(address=>address[]) shared_address_list;
    mapping(address=>mapping(address=>bool)) shared_address_map;
    mapping(address=>mapping(address=>bool)) shared_address_check_duplicate;
    mapping(address=>uint) shared_address_count;

    function add_file(string memory url) external{
        if(!uploaded_files_map[msg.sender][url]){
            uploaded_files_count[msg.sender]++;
            uploaded_files_map[msg.sender][url]=true;
            if(!uploaded_files_check_duplicate[msg.sender][url]){
                uploaded_files_list[msg.sender].push(url);
                uploaded_files_check_duplicate[msg.sender][url]=true;
            }
        }
    }

    function remove_file(string memory url) external{
        uploaded_files_map[msg.sender][url]=false;
        uploaded_files_count[msg.sender]--;
    }

    function view_files(address adr) external view returns(string[] memory){
        require(adr==msg.sender || shared_address_map[adr][msg.sender],"You are not allowed to access the files.");
        string[] memory files=new string[](uploaded_files_count[adr]);
        string[] memory uploaded_files = uploaded_files_list[adr];
        uint j=0;
        for(uint i=0;i<uploaded_files.length;i++){
            if(uploaded_files_map[adr][uploaded_files[i]]){
                files[j++]=uploaded_files[i];
            }
        }
        return files;
    }

    function add_address(address adr) external{
        if(!shared_address_map[msg.sender][adr]){
            shared_address_count[msg.sender]++;
            shared_address_map[msg.sender][adr]=true;
            if(!shared_address_check_duplicate[msg.sender][adr]){
                shared_address_list[msg.sender].push(adr);
                shared_address_check_duplicate[msg.sender][adr]=true;
            }
        }
    }

    function remove_address(address adr) external{
        shared_address_map[msg.sender][adr]=false;
        shared_address_count[msg.sender]--;
    }

    function view_address() external view returns(address[] memory){
        address[] memory adr=new address[](shared_address_count[msg.sender]);
        address[] memory shared_address = shared_address_list[msg.sender];
        uint j=0;
        for(uint i=0;i<shared_address.length;i++){
            if(shared_address_map[msg.sender][shared_address[i]]){
                adr[j++]=shared_address[i];
            }
        }
        return adr;
    }
}