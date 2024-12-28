import requests

routes = [
    "/api/v1/search?id=U082GTRTR5X",
    "/api/v1/search?username=cyteon",
    "/api/v1/data",
    "/api/v1/data?page=2",
    "/api/v1/data?total=true",
]

host = "http://localhost:5173" # https://doubloons.cyteon.hackclub.app <- prod

tests = 100

print(f"Running {tests} tests for each route")

for route in routes:
    times = []
    lowest = 100000
    highest = 0

    for i in range(tests):
        response = requests.get(host + route)
        
        if response.status_code != 200:
            print(f"Stopping test for route {route} due to non-200 status code: {response.status_code}")
            break
    
        times.append(response.elapsed.total_seconds())

        if response.elapsed.total_seconds() < lowest:
            lowest = response.elapsed.total_seconds()
        
        if response.elapsed.total_seconds() > highest:
            highest = response.elapsed.total_seconds()
    
    if len(times) == 0:
        continue
    
    print(f"Route: {route} | Average time: {sum(times) / len(times) * 1000}ms | Lowest time: {lowest * 1000}ms | Highest time: {highest * 1000}ms | Total time: {sum(times)}s")