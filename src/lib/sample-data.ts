import { User, Post, Category } from './types';
import { userStorage, postStorage, generateId } from './storage';

export const categories: Category[] = [
  { id: '1', name: 'Breakfast', color: '#FFA726', icon: '🌅' },
  { id: '2', name: 'Lunch', color: '#66BB6A', icon: '☀️' },
  { id: '3', name: 'Dinner', color: '#EF5350', icon: '🌙' },
  { id: '4', name: 'Snacks', color: '#FFCA28', icon: '🍿' },
  { id: '5', name: 'Desserts', color: '#AB47BC', icon: '🍰' },
  { id: '6', name: 'Beverages', color: '#42A5F5', icon: '🥤' },
  { id: '7', name: 'Healthy', color: '#8BC34A', icon: '🥗' },
  { id: '8', name: 'Kids Favorite', color: '#FF7043', icon: '👶' }
];

const sampleUsers: User[] = [
  {
    id: 'user1',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b33fdf68-5e1a-48ad-946b-8385facffe60.png',
    bio: 'Mom of 3, love cooking healthy meals for my family! Always trying new recipes.',
    joinedDate: '2024-01-15T10:00:00.000Z',
    location: 'Sunny Valley Community'
  },
  {
    id: 'user2',
    email: 'maria@example.com',
    name: 'Maria Rodriguez',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3e425666-fb89-4399-a334-9bffee85af84.png',
    bio: 'Traditional Mexican cuisine enthusiast. Sharing grandma\'s recipes!',
    joinedDate: '2024-01-20T14:30:00.000Z',
    location: 'Maple Street'
  },
  {
    id: 'user3',
    email: 'jenny@example.com',
    name: 'Jenny Chen',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4acc5178-c140-4931-bb0d-f04c5ffa4392.png',
    bio: 'Asian fusion cooking expert. Making healthy meals fun for kids!',
    joinedDate: '2024-02-01T09:15:00.000Z',
    location: 'Oak Ridge'
  },
  {
    id: 'user4',
    email: 'emma@example.com',
    name: 'Emma Williams',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b386feb2-2232-4e85-bbff-17d92213b363.png',
    bio: 'Baking enthusiast and busy mom. Love sharing sweet treats!',
    joinedDate: '2024-02-10T16:45:00.000Z',
    location: 'Pine Valley'
  }
];

const samplePosts: Post[] = [
  {
    id: 'post1',
    authorId: 'user1',
    author: sampleUsers[0],
    title: 'Fluffy Pancakes for Weekend Breakfast',
    description: 'Made these amazing fluffy pancakes for the kids this morning! They absolutely loved them and asked for seconds. Perfect weekend treat!',
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e40bb670-4ea3-4fc8-84aa-131657988ea8.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7a183a6a-88ae-4ca3-915e-a3fac848c223.png'
    ],
    recipe: {
      ingredients: [
        '2 cups all-purpose flour',
        '2 tablespoons sugar',
        '2 teaspoons baking powder',
        '1 teaspoon salt',
        '2 large eggs',
        '1¾ cups milk',
        '¼ cup melted butter',
        '1 teaspoon vanilla extract'
      ],
      instructions: [
        'Mix dry ingredients in a large bowl',
        'Whisk wet ingredients in separate bowl',
        'Combine wet and dry ingredients until just mixed',
        'Heat griddle over medium heat',
        'Pour batter and cook until bubbles form',
        'Flip and cook until golden brown',
        'Serve immediately with maple syrup'
      ],
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: 'Easy'
    },
    categories: [categories[0], categories[7]],
    likes: ['user2', 'user3', 'user4'],
    comments: [
      {
        id: 'comment1',
        authorId: 'user2',
        author: sampleUsers[1],
        content: 'These look absolutely delicious! My kids would love these too. Thanks for sharing the recipe! 😍',
        createdAt: '2024-03-15T11:30:00.000Z',
        likes: ['user1', 'user3']
      },
      {
        id: 'comment2',
        authorId: 'user3',
        author: sampleUsers[2],
        content: 'Perfect timing! I was just looking for a good pancake recipe for this weekend. Definitely trying this!',
        createdAt: '2024-03-15T12:15:00.000Z',
        likes: ['user1']
      }
    ],
    createdAt: '2024-03-15T10:00:00.000Z',
    updatedAt: '2024-03-15T10:00:00.000Z'
  },
  {
    id: 'post2',
    authorId: 'user2',
    author: sampleUsers[1],
    title: 'Traditional Chicken Enchiladas',
    description: 'My grandmother\'s secret recipe! The kids couldn\'t stop eating them. Made with love and passed down through generations.',
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9279c057-5109-4d6f-908f-7550cf8e604d.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9a629513-d3fe-4e83-8184-750b73a48ae6.png'
    ],
    recipe: {
      ingredients: [
        '12 corn tortillas',
        '3 cups cooked chicken, shredded',
        '2 cups Mexican cheese blend',
        '1 can enchilada sauce',
        '1 onion, diced',
        '2 cloves garlic, minced',
        '1 tsp cumin',
        '1 tsp chili powder',
        'Sour cream and cilantro for serving'
      ],
      instructions: [
        'Preheat oven to 375°F',
        'Mix chicken with onion, garlic, cumin, and chili powder',
        'Warm tortillas to make them pliable',
        'Fill each tortilla with chicken mixture and cheese',
        'Roll tightly and place in baking dish',
        'Cover with enchilada sauce and remaining cheese',
        'Bake for 20-25 minutes until bubbly',
        'Serve with sour cream and cilantro'
      ],
      prepTime: 30,
      cookTime: 25,
      servings: 6,
      difficulty: 'Medium'
    },
    categories: [categories[2], categories[7]],
    likes: ['user1', 'user3'],
    comments: [
      {
        id: 'comment3',
        authorId: 'user4',
        author: sampleUsers[3],
        content: 'This looks incredible! I love family recipes with history behind them. Can\'t wait to try it!',
        createdAt: '2024-03-14T19:20:00.000Z',
        likes: ['user2']
      }
    ],
    createdAt: '2024-03-14T18:00:00.000Z',
    updatedAt: '2024-03-14T18:00:00.000Z'
  },
  {
    id: 'post3',
    authorId: 'user3',
    author: sampleUsers[2],
    title: 'Rainbow Veggie Lunch Bowls',
    description: 'Made these colorful and nutritious lunch bowls for the kids! They love eating the rainbow and it\'s so healthy too.',
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8f642c38-dc05-4653-b3b3-d0cccb463432.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4ca7bff2-1f03-43b7-9869-55a32a7e3d1f.png'
    ],
    recipe: {
      ingredients: [
        '2 cups cooked quinoa',
        '1 cup cherry tomatoes, halved',
        '1 cucumber, diced',
        '1 bell pepper, sliced',
        '1 cup shredded carrots',
        '1 cup steamed broccoli',
        '1/2 cup corn kernels',
        '1/4 cup olive oil',
        '2 tbsp lemon juice',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Cook quinoa according to package directions',
        'Prepare all vegetables as specified',
        'Mix olive oil, lemon juice, salt, and pepper for dressing',
        'Divide quinoa among bowls',
        'Arrange vegetables in colorful sections',
        'Drizzle with dressing',
        'Serve immediately or pack for lunch'
      ],
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      difficulty: 'Easy'
    },
    categories: [categories[1], categories[6], categories[7]],
    likes: ['user1', 'user2', 'user4'],
    comments: [],
    createdAt: '2024-03-13T12:30:00.000Z',
    updatedAt: '2024-03-13T12:30:00.000Z'
  },
  {
    id: 'post4',
    authorId: 'user4',
    author: sampleUsers[3],
    title: 'Double Chocolate Chip Cookies',
    description: 'Baked these heavenly cookies for the school bake sale! They were gone in minutes. The secret is using both dark and milk chocolate chips!',
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3702cf7c-7a13-499c-a919-70da07d916a2.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3181648b-2578-4fac-86d8-fe7e6396b4ab.png'
    ],
    recipe: {
      ingredients: [
        '2¼ cups all-purpose flour',
        '1 tsp baking soda',
        '1 tsp salt',
        '1 cup butter, softened',
        '¾ cup granulated sugar',
        '¾ cup brown sugar',
        '2 large eggs',
        '2 tsp vanilla extract',
        '1 cup dark chocolate chips',
        '1 cup milk chocolate chips'
      ],
      instructions: [
        'Preheat oven to 375°F',
        'Mix flour, baking soda, and salt in bowl',
        'Cream butter and both sugars until fluffy',
        'Beat in eggs and vanilla',
        'Gradually mix in flour mixture',
        'Fold in both types of chocolate chips',
        'Drop rounded tablespoons on baking sheet',
        'Bake 9-11 minutes until golden brown',
        'Cool on wire rack'
      ],
      prepTime: 15,
      cookTime: 11,
      servings: 36,
      difficulty: 'Easy'
    },
    categories: [categories[4], categories[7]],
    likes: ['user1', 'user2', 'user3'],
    comments: [
      {
        id: 'comment4',
        authorId: 'user1',
        author: sampleUsers[0],
        content: 'These cookies look amazing! I love the idea of using both types of chocolate chips. My kids would go crazy for these! 🍪',
        createdAt: '2024-03-12T20:45:00.000Z',
        likes: ['user4']
      }
    ],
    createdAt: '2024-03-12T20:00:00.000Z',
    updatedAt: '2024-03-12T20:00:00.000Z'
  }
];

export const initializeSampleData = (): void => {
  // Only initialize if no data exists
  if (typeof window === 'undefined') return;
  
  const existingUsers = userStorage.getUsers();
  const existingPosts = postStorage.getPosts();

  if (existingUsers.length === 0) {
    sampleUsers.forEach(user => userStorage.addUser(user));
  }

  if (existingPosts.length === 0) {
    samplePosts.forEach(post => postStorage.addPost(post));
  }
};