<script lang="ts">
  import { onMount } from "svelte";

    // mock data
    let data = []

    let searched = null;

    let page = 1;
    let i = 0;
    let total = false; // else total

    onMount(async () => {
        const res = await fetch('/api/v1/data');
        data = await res.json();
    });

    async function search() {
        const res = await fetch(`/api/v1/search?username=${document.querySelector('input').value}&total=${total}`);

        let json = await res.json();
        
        if (res.ok) {
            searched = json;
        }
    }

    async function next() {
        if (page < data.pages) {
            page++;
            i = (page - 1) * 25;
        }

        const res = await fetch(`/api/v1/data?page=${page}`);
        data = await res.json();
    }

    async function prev() {
        if (page > 1) {
            page--;
            i = (page - 1) * 25;
        }

        const res = await fetch(`/api/v1/data?page=${page}`);
        data = await res.json();
    }

    async function changeSort() {
        total = !total;

        data.users.sort((a, b) => {
            return total ? b.total_doubloons - a.total_doubloons : b.current_doubloons - a.current_doubloons;
        });

        const res = await fetch(`/api/v1/data?page=${page}&total=${total}`);
        data = await res.json();

        i = 0;

        if (searched) {
            searched.rank = data.users.indexOf(searched) + 1;

            if (searched.rank == 0) {
                await search();
            }
        }
    }
</script>

<div class="flex flex-col w-full min-full min-h-screen">
    <h1 class="mx-auto mt-2 p-2 text-center flex">
        <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="72" width="72">
        <span class="ml-2 flex flex-col my-auto">
            <span class="text-5xl md:text-7xl font-bold text-left">Doubloons</span>
            <span class="text-start text-sm  ml-1 text-muted">(actual doubloon data, for opted-in people)</span>
        </span>
    </h1>

    <div class="p-3 shadow-md rounded-lg mx-auto mt-4 mb-8 mx-2 md:mx-8 h-full bg-surface">
        <div class="flex flex-col md:flex-row mb-4">
            <div>
                <h2 class="text-4xl font-semibold">Leaderboard</h2>
                <p class="text-lg text-muted mt-2 mb-2 md:mt-0">
                    Opt-in/out at
                    <a href="https://highseas.hackclub.com/signpost" class="text-blue">The Signpost</a>!
                </p>
            </div>
            <div class="md:ml-auto">
                <div class="flex flex-row-reverse h-fit md:flex-row">
                    <input 
                        type="text" 
                        class="text-lg w-full p-2 rounded-lg outline-none border border-border transition-all duration-300 bg-base" 
                        placeholder="Enter username"
                    >
                    <button 
                        class="bg-red text-lg text-white p-2 rounded-lg mr-2 md:mr-0 md:ml-2"
                        on:click={async () => {
                            searched = data.users.find(user => (user.username || "").toLowerCase() === document.querySelector('input').value.toLowerCase());

                            if (!searched) {
                                await search();
                            } else {
                                searched.rank = data.users.indexOf(searched) + 1;
                            }
                        }}
                    >
                        Search
                    </button>
                </div>

                <label class="flex justify-end mt-2">
                    <input 
                        type="checkbox"
                        class="sr-only peer"
                        on:change={() => changeSort()}
                        checked={total}
                    />
                    
                    <span>Current</span>
                    
                    <div class="
                        relative w-11 h-6
                        rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white 
                        after:rounded-full after:h-5 after:w-5 after:transition-all bg-blue mx-2
                    "></div>

                    <span>All Time</span>
                </label>
            </div>
        </div>

        {#if searched}
            <div class="flex p-2 flex-col md:flex-row bg-yellow/10 rounded-tl-md rounded-tr-md mt-2">
                <div class="flex">
                    <p class="text-2xl my-auto font-semibold mr-6">#{searched.rank}</p>

                    <img src={`https://cachet.dunkirk.sh/users/${searched.id}/r`} class="rounded-full" height="48" width="48" alt="profile_picture" />
                    <h1 class="text-2xl my-auto font-semibold ml-2">@{searched.username}</h1>
                </div>
                <div class="flex flex-grow md:ml-2">
                    <a href={searched.slack} class="mr-5 my-auto">
                        <img src="/slack.svg" class="my-auto" alt="Slack" height="24" width="24">
                    </a>
                    <p class="ml-auto text-2xl my-auto font-semibold flex">
                        <span class="my-auto mr-1">{parseInt(total ? searched.total_doubloons : searched.current_doubloons)}</span>
                        <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="24" width="24">
                    </p>
                </div>
            </div>
        {/if}

        {#each data.users as user, i} 
            <div class={`flex flex-col md:flex-row p-2 ${(i + (page - 1) * 25) % 2 == 0 ? '' : 'bg-base'}`}>
                <div class="flex">
                    <p class="text-2xl my-auto font-semibold mr-6">#{i + ((page - 1) * 25) + 1}</p>

                    <img src={`https://cachet.dunkirk.sh/users/${user.id}/r`} class="rounded-full" height="48" width="48" alt="profile_picture" />
                    <h1 class="text-2xl my-auto font-semibold ml-2">@{user.username}</h1>
                </div>
                <div class="flex flex-grow md:ml-2">
                    <a href={user.slack} class="mr-5 my-auto">
                        <img src="/slack.svg" class="my-auto" alt="Slack" height="24" width="24">
                    </a>
                    <p class="ml-auto text-2xl my-auto font-semibold flex">
                        <span class="my-auto mr-1">{parseInt(total ? user.total_doubloons : user.current_doubloons)}</span>
                        <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="24" width="24">
                    </p>
                </div>
            </div>  
        {/each}

        <div class="flex justify-center mt-4 mb-2">
            <button 
                class="bg-blue text-lg text-white p-2 rounded-lg"
                on:click={() => prev()}
            >
                Back
            </button>

            <span class="text-2xl font-semibold mx-4 my-auto">
                {page}/{data.pages}
            </span>

            <button 
                class="bg-blue text-lg text-white p-2 rounded-lg"
                on:click={() => next()}
            >
                Next
            </button>
        </div>
    </div>

    <footer class="text-center text-muted mb-6">
        <a href="https://github.com/cyteon/doubloon-leaderboard" class="text-center text-blue">Repo</a>
        | <a href="https://airtable.com/appTeNFYcUiYfGcR6/shro4hnLq63fT8psX" class="text-center text-blue">Airtable</a>
    </footer>
</div>