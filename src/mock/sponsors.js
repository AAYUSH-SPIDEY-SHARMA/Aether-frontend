export const sponsors = {
    title: [
        {
            id: 1,
            name: 'DOTCODE',
            logo: '/sponsors/techcorp.svg',
            website: 'https://DOTCODE.online',
            tier: 'title'
        }
    ],
    platinum: [
        {
            id: 2,
            name: 'DOTCODE',
            logo: '/sponsors/innovatetech.svg',
            website: 'https://DOTCODE.online',
            tier: 'platinum'
        },
        {
            id: 3,
            name: 'DOTCODE',
            logo: '/sponsors/cloudnine.svg',
            website: 'https://DOTCODE.online',
            tier: 'platinum'
        }
    ],
    gold: [
        {
            id: 4,
            name: 'DOTCODE',
            logo: '/sponsors/datadriven.svg',
            website: 'https://DOTCODE.online',
            tier: 'gold'
        },
        {
            id: 5,
            name: 'DOTCODE',
            logo: '/sponsors/codebase.svg',
            website: 'https://DOTCODE.online',
            tier: 'gold'
        },
        {
            id: 6,
            name: 'DOTCODE',
            logo: '/sponsors/devtools.svg',
            website: 'https://DOTCODE.online',
            tier: 'gold'
        }
    ],
    silver: [
        {
            id: 7,
            name: 'DOTCODE',
            logo: '/sponsors/startuphub.svg',
            website: 'https://DOTCODE.online',
            tier: 'silver'
        },
        {
            id: 8,
            name: 'DOTCODE',
            logo: '/sponsors/teched.svg',
            website: 'https://DOTCODE.online',
            tier: 'silver'
        },
        {
            id: 9,
            name: 'DOTCODE',
            logo: '/sponsors/bytesize.svg',
            website: 'https://DOTCODE.online',
            tier: 'silver'
        },
        {
            id: 10,
            name: 'DOTCODE',
            logo: '/sponsors/hackify.svg',
            website: 'https://DOTCODE.online',
            tier: 'silver'
        }
    ]
};

export const getAllSponsors = () => [
    ...sponsors.title,
    ...sponsors.platinum,
    ...sponsors.gold,
    ...sponsors.silver
];
