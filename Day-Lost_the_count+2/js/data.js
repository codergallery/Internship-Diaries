const products = [
    {
        id: 'mc-01',
        name: 'Manchester City Home Shirt 24/25',
        team: 'Manchester City',
        season: '2024/25',
        price: 5999,
        originalPrice: null,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: 'https://www.soccerbox.com/media/catalog/product/cache/e5c18d5f608fefb2b3ef83fcb1922b34/m/a/man-city-home-shirt-24.jpg',
        description: 'The official Manchester City home shirt for the 2024/25 season. Featuring the classic sky blue with modern trims. Engineered for peak performance and ultimate fan pride.'
    },
    {
        id: 'mc-02',
        name: 'Manchester City Away Shirt 24/25',
        team: 'Manchester City',
        season: '2024/25',
        price: 5999,
        originalPrice: 6999,
        sizes: ['M', 'L', 'XL'],
        image: 'https://www.soccerbox.com/media/catalog/product/cache/e5c18d5f608fefb2b3ef83fcb1922b34/m/a/man-city-away-shirt-24.jpg',
        description: 'Take the City spirit on the road with the bold new 2024/25 away kit. Designed with a striking neon aesthetic and vibrant accents.'
    },
    {
        id: 'mc-03',
        name: 'Manchester City Third Shirt 24/25',
        team: 'Manchester City',
        season: '2024/25',
        price: 6499,
        originalPrice: null,
        sizes: ['S', 'M', 'L'],
        image: 'https://www.soccerbox.com/media/catalog/product/cache/e5c18d5f608fefb2b3ef83fcb1922b34/m/a/man-city-third-shirt-24.jpg',
        description: 'Stand out from the crowd in the Manchester City 2024/25 third shirt. A unique colorway celebrating the vibrant culture of Manchester.'
    },
    {
        id: 'rm-01',
        name: 'Real Madrid Home Shirt 24/25',
        team: 'Real Madrid',
        season: '2024/25',
        price: 6499,
        originalPrice: null,
        sizes: ['S', 'M', 'L', 'XL'],
        image: 'https://www.soccerbox.com/media/catalog/product/cache/e5c18d5f608fefb2b3ef83fcb1922b34/r/e/real-madrid-home-shirt-24.jpg',
        description: 'The iconic white of Los Blancos. Real Madrid home shirt for the 24/25 season, carrying the weight of European royalty.'
    },
    {
        id: 'fcb-01',
        name: 'FC Barcelona Home Shirt 24/25',
        team: 'FC Barcelona',
        season: '2024/25',
        price: 5999,
        originalPrice: null,
        sizes: ['M', 'L', 'XL'],
        image: 'images/barcelona-home-24-25.jpg',
        description: 'Més que un club. Celebrating 125 years of Barcelona with a striking half-and-half design in deep royal blue and noble red. Gold accents honour the club\'s legacy.'
    },
    {
        id: 'ars-01',
        name: 'Arsenal Home Shirt 24/25',
        team: 'Arsenal',
        season: '2024/25',
        price: 5999,
        originalPrice: null,
        sizes: ['S', 'M', 'L'],
        image: 'https://www.soccerbox.com/media/catalog/product/cache/e5c18d5f608fefb2b3ef83fcb1922b34/a/r/arsenal-home-shirt-24.jpg',
        description: 'Classic red and white. The Gunners are ready for the new campaign at the Emirates.'
    },
    {
        id: 'liv-01',
        name: 'Liverpool Home Shirt 24/25',
        team: 'Liverpool',
        season: '2024/25',
        price: 5999,
        originalPrice: 6499,
        sizes: ['S', 'L', 'XL'],
        image: 'https://www.soccerbox.com/media/catalog/product/cache/e5c18d5f608fefb2b3ef83fcb1922b34/l/i/liverpool-home-shirt-24.jpg',
        description: 'Anfield awaits. The new Liverpool home kit features striking details celebrating the club’s legendary heritage.'
    },
    {
        id: 'mu-01',
        name: 'Manchester United Home Shirt 24/25',
        team: 'Manchester United',
        season: '2024/25',
        price: 5999,
        originalPrice: null,
        sizes: ['M', 'L', 'XXL'],
        image: 'https://www.soccerbox.com/media/catalog/product/cache/e5c18d5f608fefb2b3ef83fcb1922b34/m/a/man-utd-home-shirt-24.jpg',
        description: 'The Red Devils gear up for 24/25 with this classic red design, a must-have for the Stretford End faithful.'
    },
    {
        id: 'bay-01',
        name: 'Bayern Munich Home Shirt 24/25',
        team: 'Bayern Munich',
        season: '2024/25',
        price: 6499,
        originalPrice: 7499,
        sizes: ['S', 'M', 'L'],
        image: 'images/bayern-home-24-25.jpg',
        description: 'Mia San Mia. The 2024/25 home shirt features a revolutionary triple-red design with wavy stripes and diamond patterns celebrating Bayern\'s treble-winning heritage.'
    },
    {
        id: 'psg-01',
        name: 'Paris Saint-Germain Home Shirt 24/25',
        team: 'Paris Saint-Germain',
        season: '2024/25',
        price: 6499,
        originalPrice: null,
        sizes: ['M', 'L', 'XL'],
        image: 'images/psg-home-24-25.jpg',
        description: 'Ici c\'est Paris. The iconic Hechter stripe returns with an artistic paintbrush effect, celebrating Parisian street-art culture for the 2024/25 season.'
    }
];

// Helper to get formatted price
const formatPrice = (price) => {
    return '₹' + price.toLocaleString('en-IN');
};
