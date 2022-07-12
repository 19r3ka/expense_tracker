<script setup>
    import TabMenu from "primevue/tabmenu";

    const views = [
        {
            to: {name: "HomePage"},
            label: "Home",
            icon: "pi pi-home",
        },
        {
            to: {name: "ExpensesPage"},
            label: "History",
            icon: "pi pi-credit-card",
        },
        // {
        //     to: {name: "SearchPage"},
        //     label: "Search",
        //     icon: "pi pi-search",
        // },
        {
            to: {name: "SettingsPage"},
            label: "Settings",
            icon: "pi pi-fw pi-cog",
        },
    ];
</script>

<template>
    <nav class="component">
        <TabMenu :model="views" />
    </nav>
</template>