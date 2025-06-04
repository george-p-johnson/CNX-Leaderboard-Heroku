<template>
  <div id="container">
     <img id="logo" src="/img/logo.png">

    <ul>
        <li v-for="(entry, index) in topEntries" :key="index" class="leaderboard-item">
            <div class="rank-circle">
                <img :src="getRankImage(index)" alt="rank" />
            </div>
            <div class="info">
                <span class="name">{{ entry.name }}</span>
                <span class="score">{{ entry.score }} pts</span>
            </div>
        </li>
    </ul>

     <!-- Donations Display -->
    <div id="dontations-container">
        <h3>Total Donations Raised</h3>
        <div class="donations-display">
            
            <div class="donation-amount">${{ formattedDonation }}</div>
        </div>
    </div>

  </div>
</template>

<style scoped>
#container {
  margin: 0 auto;
  display: table;
  background-color: #90D0FE;
  height: 1920px;
  width: 1080px;
  background-image: url('/img/bg.png');
}

#logo {
    margin: 100px auto 150px auto;
    display: table;
}

ul {
  list-style: none;
  padding: 0;
}

h3 {
    color: #ffffff;
    font-size: 36px;
    margin: 100px auto 10px auto;
    font-family: "AvantGardeForSalesforce-Demi", sans-serif;
    display: table;
}

.leaderboard-item {
    position: relative;
    margin-bottom: 1rem;
    height: 170px;
    width: 720px;
    background-color: #ffffff;
    border-radius: 25px;
    color: #000000;
    text-align: left;
    text-indent: 125px;
    line-height: 100px; 
    font-size: 80px;
    font-family: "AvantGardeForSalesforce-Demi", sans-serif;
    margin: 35px auto; 
    display: block; 
}

.rank-circle {
  position: relative;
  width: 100px;
}

.rank-circle img {
    position: absolute;
    left: 0;
    top: 15px;
    padding-left: 20px;
}

.rank-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.info {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.name {
    margin-left: 20px;
    font-size: 80px;
}

.score {
    position: absolute;
    right: 0;
    padding-right: 40px;
    font-size: 30px;
    top: 50%;
    transform: translateY(-50%);
}

#dontations-container{
    position: relative;
    top: 25px;
}

.donations-display {
  text-align: center;
  margin: 0px auto 200px auto;
  border-radius: 100px;
  width: 850px;
  background-color: #ffffff;
}

.donation-amount {
    color: #000000;
    font-size: 100px;
    font-weight: bold;
    font-family: "AvantGardeForSalesforce-Demi", sans-serif;
}
</style>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue';
import { store } from '../store.js';

const LEADERBOARD_API_URL = 'https://script.google.com/macros/s/AKfycbxsKJvqveL30rKows7CiECYAeyPY2jeC28JLSW7PupuK8gX-wYtqmyEKgNhAmhOfB6P/exec';
const DONATIONS_API_URL = 'https://script.google.com/macros/s/AKfycbxu6UrZQo5_w4_PE6AlGrthJruSzlyhJ-8FHLNFBmw30Q4xC5cgzTr92ZYzocqVFZKRcw/exec';

let intervalId = null;

// Fetch leaderboard data from Google Sheet
const fetchEntries = async () => {
  try {
    const response = await fetch(LEADERBOARD_API_URL);
    store.entries = await response.json();
  } catch (err) {
    console.error('Error fetching entries:', err);
  }
};

// Fetch donations data
const fetchDonations = async () => {
  try {
    const response = await fetch(DONATIONS_API_URL);
    const data = await response.json();
    store.donation = data.donation || 0;
  } catch (err) {
    console.error('Error fetching donations:', err);
  }
};

// Combined fetch function
const fetchAll = async () => {
  await Promise.all([fetchEntries(), fetchDonations()]);
};

onMounted(() => {
  fetchAll(); // initial fetch
  intervalId = setInterval(fetchAll, 5000); // fetch every 5 seconds
});

onUnmounted(() => {
  clearInterval(intervalId);
});

// Computed top 5
const topEntries = computed(() => {
  return [...store.entries].sort((a, b) => b.score - a.score).slice(0, 5);
});

// Format donation amount with commas and 2 decimal places
const formattedDonation = computed(() => {
  return (store.donation || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
});


function getRankImage(index) {
  return `/img/rank${index + 1}.png`;
}
</script>









<!-- Leaderboard - https://script.google.com/macros/s/AKfycbxsKJvqveL30rKows7CiECYAeyPY2jeC28JLSW7PupuK8gX-wYtqmyEKgNhAmhOfB6P/exec -->

<!-- Donations - https://script.google.com/macros/s/AKfycbxu6UrZQo5_w4_PE6AlGrthJruSzlyhJ-8FHLNFBmw30Q4xC5cgzTr92ZYzocqVFZKRcw/exec -->