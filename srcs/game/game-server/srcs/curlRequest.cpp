#include "Server.hpp"

// static int debug_callback(CURL* handle, curl_infotype type, char* data, size_t size, void* userptr)
// {
// 	(void)handle;
// 	(void)userptr;
// 	switch (type) {
// 		case CURLINFO_HEADER_OUT:
// 			std::cout << "=== Requete ===" << std::endl;
// 			std::cout.write(data, size);
// 			std::cout << std::endl;
// 			break;

// 		case CURLINFO_DATA_OUT:
// 			std::cout << "=== Corps ===\n";
// 			std::cout.write(data, size);
// 			std::cout << std::endl;
// 			break;

// 		default:
// 			break;
// 	}
// 	return 0;
// }

static size_t write_callback(char* ptr, size_t size, size_t nmemb, void* userdata)
{
	size_t totalSize = size * nmemb;
	std::string* response = static_cast<std::string*>(userdata);
	response->append(ptr, totalSize);

	return (totalSize);
}

static void	generateToken(Server &server, CURL *curl, CURLcode &result)
{
	struct curl_slist *headers = NULL;

	std::string body = R"({"clientId":")" + server.getServerId() + R"(", "clientSecret":")" + server.getServerSecret() + R"("})";

	//fill the headers
	headers = curl_slist_append(headers, "Content-Type: application/json");

	//set the headers of the request
	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

	//set the url for the request
	curl_easy_setopt(curl, CURLOPT_URL, "http://node-c:3000/auth/server");

	//define the POST method and put the body in the request
	curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());

	//define the fonction used to gather the response
	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

	//gather the response
	std::string response;

	curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

	//same as the -v of curl, just write what's happening
	// curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

	
	//use for debugging
	// curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
	// curl_easy_setopt(curl, CURLOPT_DEBUGFUNCTION, debug_callback);

	//perform the request

	result = curl_easy_perform(curl);
	if (result != CURLE_OK)
	{
		fprintf(stderr, "curl_easy_perform() failed : %s\n", curl_easy_strerror(result));
	}

	long responseCode;

	curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &responseCode);

	//free the headers
	curl_slist_free_all(headers);

	if (!response.empty())
	{
		if (response.find(R"("token":)") != response.npos)
			server.setServerToken(response.substr(response.find(':') + 2, 185));
	}

	curl_easy_reset(curl);
}

static void	postViaCurl(Server &server, CURL *curl, CURLcode &result, std::string url, std::string body)
{
	struct curl_slist *headers = NULL;

	headers = curl_slist_append(headers, "Content-Type: application/json");

	std::string bearer = "Authorization: Bearer " + server.getServerToken();

	headers = curl_slist_append(headers, bearer.c_str());

	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

	curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

	curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());

	// curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

	
	//use for debugging
	// curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
	// curl_easy_setopt(curl, CURLOPT_DEBUGFUNCTION, debug_callback);

	result = curl_easy_perform(curl);
	if (result != CURLE_OK)
		fprintf(stderr, "curl_easy_perform() failed : %s\n", curl_easy_strerror(result));

	long responseCode;

	curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &responseCode);

	curl_slist_free_all(headers);

	curl_easy_reset(curl);

	if (responseCode == 401)
	{
		generateToken(server, curl, result);
		postViaCurl(server, curl, result, url, body);
	}
}

static void	patchViaCurl(Server &server, CURL *curl, CURLcode &result, std::string url, std::string body)
{
	struct curl_slist *headers = NULL;

	headers = curl_slist_append(headers, "Content-Type: application/json");

	std::string bearer = "Authorization: Bearer " + server.getServerToken();

	headers = curl_slist_append(headers, bearer.c_str());

	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

	curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

	//we still use a POST for base
	curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());

	//there is no CURLOPT enum for PATCH so we create a custom PATCH, it replace the POST method defined just above
	curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PATCH");

	// curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

	
	// use for debugging
	// curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
	// curl_easy_setopt(curl, CURLOPT_DEBUGFUNCTION, debug_callback);

	result = curl_easy_perform(curl);
	if (result != CURLE_OK)
		fprintf(stderr, "curl_easy_perform() failed : %s\n", curl_easy_strerror(result));

	long responseCode;

	curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &responseCode);

	curl_slist_free_all(headers);

	curl_easy_reset(curl);

	if (responseCode == 401)
	{
		generateToken(server, curl, result);
		patchViaCurl(server, curl, result, url, body);
	}
}

void	sendViaCurl(Server &server, std::string url, std::string method, std::string body, int flag)
{
	CURL		*curl;

	CURLcode	result = curl_global_init(CURL_GLOBAL_ALL);
	if (result != CURLE_OK)
		return ;

	curl = curl_easy_init();
	if (!curl)
		return ;

	if (server.getServerToken().empty() || flag)
		generateToken(server, curl, result);

	if (method == "POST")
		postViaCurl(server, curl, result, url, body);

	if (method == "PATCH")
		patchViaCurl(server, curl, result, url, body);

	curl_easy_cleanup(curl);
	curl_global_cleanup();

	return ;
}

void	sendPlayerResultCurl(Server &server, Session const &session, Player &player)
{
	int xp = player.getKills();
	int completionTime = static_cast<int>(session.getActualTime());
	if (player.HasWin())
		xp += 10;

	if (!player.getFinished())
	{
		completionTime = 1200;
		xp = 0;
	}

	std::string msg = "{\"sessionGameId\":\"" + session.getSessionId() + "\""
				+ ",\"playerId\":\"" + player.getUid() + "\""
				+ ",\"completionTime\":" + std::to_string(completionTime)
				+ ",\"ennemiesKilled\":" + std::to_string(player.getKills())
				+ ",\"isWinner\":" + std::to_string(player.HasWin())
				+ ",\"gainedXp\":" + std::to_string(xp)
				+ "}";

	std::string url = "http://node-c:3000/game/result/" + player.getUid();

	sendViaCurl(server, url, "PATCH", msg, 0);
	std::cout << "player result sended" << std::endl;
}