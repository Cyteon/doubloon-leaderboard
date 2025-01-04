<script lang="ts">
    import { onMount } from "svelte";
  
    export let data;
    let stats = {};
    let user = {};

    let searched = false;
  
    let page = 1;
    let i = 0;
    let total = false; // else current
  
    onMount(async () => {
        const res = await fetch(`/api/v1/search?id=${data.props.id}`);
        const json = await res.json();

        user = json.user;
        stats = {
            opted_in: json.opted_in,
            time_since_last_update: json.time_since_last_update
        }

        console.log(user)
    });
  </script>
  
  <svelte:head> 
      <meta name="og:title" content={`Stats for ${data.props.id} on HighSeas`} />
      <meta name="og:image" content={`https://cachet.dunkirk.sh/users/${data.props.id}/r`} />
      <meta name="og:url" content="https://doubloons.cyteon.hackclub.app/user/${data.props.id}" />
  </svelte:head>
  
  <div class="flex flex-col w-full min-full min-h-screen">
      {#if user}
        <h1 class="mx-auto mt-2 p-2 text-center flex">
            <img src={`https://cachet.dunkirk.sh/users/${data.props.id}/r`} class="inline-block rounded-md" alt="Doubloon" height="72" width="72">
            <span class="ml-2 flex flex-col my-auto">
                <span class="text-5xl md:text-7xl font-bold text-left">{user.username}</span>
            </span>
        </h1>

        <div class="p-3 shadow-md rounded-lg mt-4 mb-8 mx-2 md:mx-8 h-full bg-surface">
            <div class="flex flex-col md:flex-row mb-4">    
                <h2 class="text-4xl font-semibold">User Stats</h2>
            </div>

            <div class="rounded-md p-2 bg-base grid grid-cols-2 max-w-60 text-2xl">
                <p>Earned:</p> <p class="ml-auto flex font-bold text-green-400">+ {user.total_doubloons} <img src="/doubloon.png" class="inline-block object-scale-down ml-1" alt="Doubloon" height="20" width="20"></p>
                <p>Spent:</p> <p class="ml-auto flex font-bold text-red">- {user.total_doubloons - user.current_doubloons} <img src="/doubloon.png" class="inline-block object-scale-down ml-1" alt="Doubloon" height="20" width="20"></p>
                <p>Current:</p> <p class="ml-auto flex font-bold">= {user.current_doubloons} <img src="/doubloon.png" class="inline-block object-scale-down ml-1" alt="Doubloon" height="20" width="20"></p>
            </div>
        </div>

        <footer class="text-center text-muted mb-6 mt-auto">
            <a href="https://github.com/cyteon/doubloon-leaderboard" class="text-center text-blue">Repo</a>
            | <a href="https://airtable.com/appTeNFYcUiYfGcR6/shro4hnLq63fT8psX" class="text-center text-blue">Airtable</a>
            | {stats.opted_in} opted-in
            | { 
                stats.time_since_last_update/1000 < 60 
                    ? `${(stats.time_since_last_update/1000).toFixed(1)} seconds ago` 
                    : `${(stats.time_since_last_update/1000/60).toFixed(1)} minutes ago`
            }
        </footer>
    {:else}
        <div class="m-auto text-center">
            <h2 class="text-4xl font-semibold text-red">User not found</h2>
            <a href="/" class="text-blue hover:underline">Back to leaderboard</a>
        </div>
    {/if}
  </div>