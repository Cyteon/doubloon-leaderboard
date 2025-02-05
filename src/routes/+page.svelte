<script lang="ts">
  import { onMount } from "svelte";

    let data = []

    let searched = false;
    let query = "";

    let page = 1;
    let i = 0;
    let sortBy = "current";

    onMount(async () => {
        const res = await fetch('/api/v1/data');
        data = await res.json();
    });

    async function search() {
        const res = await fetch(`/api/v1/search?username=${query}&sortBy=${sortBy}`);

        let json = await res.json();
        
        if (res.ok) {
            data = json;
            searched = true;
            page = 1;
        }
    }

    async function next() {
        if (page < data.pages) {
            page++;
            i = (page - 1) * 25;

            const res = await fetch(`/api/v1/data?page=${page}&sortBy=${sortBy}`);
            data = await res.json();
        }
    }

    async function prev() {
        if (page > 1) {
            page--;
            i = (page - 1) * 25;

            const res = await fetch(`/api/v1/data?page=${page}&sortBy=${sortBy}`);
            data = await res.json();
        }
    }

    async function changeSort() {
        data.users.sort((a, b) => {
            if (sortBy === "total") {
                return b.total_doubloons - a.total_doubloons;
            } else if (sortBy === "spent") {
                return b.total_doubloons - b.current_doubloons - (a.total_doubloons - a.current_doubloons);
            } else {
                return b.current_doubloons - a.current_doubloons;
            }
        });

        let res;

        if (searched) {
            res = await fetch(`/api/v1/search?username=${query}&sortBy=${sortBy}&page=${page}`);
        } else {
            res = await fetch(`/api/v1/data?page=${page}&sortBy=${sortBy}`);
        }

        data = await res.json();

        i = 0;
    }

    const cheaters = [ "AlphastT101", "SamChan23267", "JeevanKoirala" ];
</script>

<svelte:head>
    <meta name="og:title" content="Doubloon Leaderboard" />
    <meta name="og:description" content="Doubloon leaderboard for HighSeas" />
    <meta name="og:image" content="https://doubloons.cyteon.hackclub.app/doubloon.png" />
    <meta name="og:url" content="https://doubloons.cyteon.hackclub.app" />
</svelte:head>

<div class="flex flex-col w-full min-full min-h-screen">
    <h1 class="mx-auto mt-2 p-2 text-center flex">
        <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="72" width="72">
        <span class="ml-2 flex flex-col my-auto">
            <span class="text-5xl md:text-7xl font-bold text-left">Doubloons</span>
            <span class="text-start text-sm  ml-1 text-muted">(actual doubloon data, for opted-in people)</span>
        </span>
    </h1>

    <div class="p-3 shadow-md rounded-lg mt-4 mb-7 mx-2 md:mx-8 h-full bg-surface">
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
                        bind:value={query}
                    >
                    <button 
                        class="bg-red text-lg text-white p-2 rounded-lg mr-2 md:mr-0 md:ml-2"
                        on:click={async () => {
                            if (query == "") {
                                const res = await fetch(`/api/v1/data?page=${page}&sortBy=${sortBy}`);
                                data = await res.json();
                                searched = false;
                                return;
                            }
                            
                            await search();
                        }}
                    >
                        Search
                    </button>
                </div>

                <div class="rounded-md p-1 bg-base mt-2 flex space-x-2">
                    <button 
                        class={`sorting-button ${sortBy === "current" ? 'bg-surface' : 'bg-base hover:bg-surface/50'}`}
                        on:click={() => {
                            if (sortBy !== "current") {
                                sortBy = "current";
                                changeSort();
                            }
                        }}
                    >Current</button>

                    <button 
                        class={`sorting-button ${sortBy === "total" ? 'bg-surface' : 'bg-base hover:bg-surface/50'}`}
                        on:click={() => {
                            if (sortBy !== "total") {
                                sortBy = "total";
                                changeSort();
                            }
                        }}
                    >Total</button>

                    <button 
                        class={`sorting-button ${sortBy === "spent" ? 'bg-surface' : 'bg-base hover:bg-surface/50'}`}
                        on:click={() => {
                            if (sortBy !== "spent") {
                                sortBy = "spent";
                                changeSort();
                            }
                        }}
                    >Spent</button>
                </div>
            </div>
        </div>

        {#each data.users as user, i} 
            <div class={`flex flex-col md:flex-row p-2 ${(i + (page - 1) * 25) % 2 == 0 ? '' : 'bg-base'}`}>
                <div class="flex">
                    <p class="text-2xl my-auto font-semibold mr-6">#{searched ? user.rank : i + ((page - 1) * 25) + 1}</p>

                    <img src={`https://cachet.dunkirk.sh/users/${user.id}/r`} class="rounded-md w-[48px] h-[48px]" alt="profile_picture" />
                    <a 
                        href={`/user/${user.id}`}
                        class="text-2xl mt-1.5 font-semibold ml-2 truncate max-w-24 min-[350px]:max-w-48 min-[450px]:max-w-64 min-[700px]:max-w-fit"
                    >
                        {user.username || user.id}
                    </a>
                </div>
                <div class="flex flex-grow md:ml-2">
                    <a href={user.slack} class="mr-5 my-auto">
                        <img src="/slack.svg" class="my-auto" alt="Slack" height="24" width="24">
                    </a>
                    <p class="ml-auto text-2xl my-auto font-semibold flex">
                        {#if cheaters.includes(user.username)}
                            <span class="text-muted text-lg my-auto mr-4">(cheater)</span>
                        {/if}
                        <span class="my-auto mr-1">{parseInt(
                            sortBy == "total" ? user.total_doubloons : (
                                sortBy == "spent" ? user.total_doubloons - user.current_doubloons 
                                : user.current_doubloons
                            )
                        )}</span>
                        <img src="/doubloon.png" class="inline-block" alt="Doubloon" height="24" width="24">
                    </p>
                </div>
            </div>  
        {/each}

        <div class="flex justify-center mt-4 mb-2">
            <button 
                class="bg-darkerblue text-lg text-white p-2 rounded-lg"
                on:click={() => prev()}
            >
                Back
            </button>

            <span class="text-2xl font-semibold mx-4 my-auto">
                {page}/{data.pages}
            </span>

            <button 
                class="bg-darkerblue text-lg text-white p-2 rounded-lg"
                on:click={() => next()}
            >
                Next
            </button>
        </div>
    </div>

    <footer class="text-center text-muted mb-6 mt-auto">
        <div class="text-muted">
            <a href="https://github.com/cyteon/doubloon-leaderboard" class="text-blue hover:underline">Repo</a>
            | <a href="https://airtable.com/appTeNFYcUiYfGcR6/shro4hnLq63fT8psX" class="text-blue hover:underline">Airtable</a>
            | {data.opted_in} opted-in
            | { 
                data.time_since_last_update/1000 < 60 
                    ? `${(data.time_since_last_update/1000).toFixed(1)} seconds ago` 
                    : `${(data.time_since_last_update/1000/60).toFixed(1)} minutes ago`
            }
        </div>

        <a href="https://github.com/cyteon" class="text-yellow hover:underline" target="_blank">Cyteon</a> © 2024-2025 / AGPL-3.0
    </footer>
</div>

<style>
    .sorting-button {
        transition: all 300ms;
        width: 33%;
        padding: 0.5rem;
        border-radius: 0.5rem;

        @apply text-lg;
    }
</style>