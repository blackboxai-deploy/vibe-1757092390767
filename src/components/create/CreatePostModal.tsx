'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { postStorage, generateId } from '@/lib/storage';
import { Post, Recipe } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }: CreatePostModalProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    images: [] as string[],
    recipe: null as Recipe | null,
    categories: [] as string[]
  });

  const [recipeData, setRecipeData] = useState({
    ingredients: [''],
    instructions: [''],
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard'
  });

  // Available categories
  const categories = [
    { id: '1', name: 'Breakfast', color: '#FFA726' },
    { id: '2', name: 'Lunch', color: '#66BB6A' },
    { id: '3', name: 'Dinner', color: '#EF5350' },
    { id: '4', name: 'Snacks', color: '#FFCA28' },
    { id: '5', name: 'Desserts', color: '#AB47BC' },
    { id: '6', name: 'Beverages', color: '#42A5F5' },
    { id: '7', name: 'Healthy', color: '#8BC34A' },
    { id: '8', name: 'Kids Favorite', color: '#FF7043' }
  ];

  const handleClose = () => {
    setCurrentStep(1);
    setPostData({
      title: '',
      description: '',
      images: [],
      recipe: null,
      categories: []
    });
    setRecipeData({
      ingredients: [''],
      instructions: [''],
      prepTime: '',
      cookTime: '',
      servings: '',
      difficulty: 'Easy'
    });
    setError('');
    onClose();
  };

  const handleAddImage = () => {
    // For demo, we'll add placeholder images
    const imagePrompts = [
      'Delicious+homemade+meal+on+elegant+plate',
      'Beautiful+food+photography+with+natural+lighting',
      'Family+enjoying+homemade+dinner+together',
      'Colorful+healthy+ingredients+arranged+beautifully'
    ];
    
    const randomPrompt = imagePrompts[Math.floor(Math.random() * imagePrompts.length)];
    const newImage = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dc97c424-9477-4c55-97e6-b9966396603d.png}`;
    
    setPostData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setPostData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setPostData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleAddIngredient = () => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleAddInstruction = () => {
    setRecipeData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => i === index ? value : item)
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    setRecipeData(prev => ({
      ...prev,
      instructions: prev.instructions.map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create recipe object if ingredients exist
      let recipe: Recipe | undefined = undefined;
      if (recipeData.ingredients.some(ing => ing.trim())) {
        recipe = {
          ingredients: recipeData.ingredients.filter(ing => ing.trim()),
          instructions: recipeData.instructions.filter(ins => ins.trim()),
          prepTime: recipeData.prepTime ? parseInt(recipeData.prepTime) : undefined,
          cookTime: recipeData.cookTime ? parseInt(recipeData.cookTime) : undefined,
          servings: recipeData.servings ? parseInt(recipeData.servings) : undefined,
          difficulty: recipeData.difficulty
        };
      }

      // Create post object
      const newPost: Post = {
        id: generateId(),
        authorId: user.id,
        author: user,
        title: postData.title,
        description: postData.description,
        images: postData.images,
        recipe,
        categories: categories.filter(cat => postData.categories.includes(cat.id)),
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save post
      postStorage.addPost(newPost);

      // Success - close modal and refresh
      onPostCreated();
      handleClose();
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return postData.title.trim() && postData.description.trim();
    }
    if (currentStep === 3) {
      return postData.categories.length > 0;
    }
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Share Your Creation ✨</DialogTitle>
          <DialogDescription>
            Tell the community about your delicious creation today!
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-8 h-1 mx-2 ${
                  currentStep > step ? 'bg-orange-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 mb-4">
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>What did you make?</CardTitle>
                <CardDescription>Tell us about your delicious creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Dish Name</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Fluffy Pancakes with Fresh Berries"
                    value={postData.title}
                    onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Share what made this special - who you cooked it for, why you chose this recipe, how it turned out..."
                    value={postData.description}
                    onChange={(e) => setPostData(prev => ({ ...prev, description: e.target.value }))}
                    className="border-orange-200 focus:border-orange-400 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Images & Recipe */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="images">📸 Photos</TabsTrigger>
                <TabsTrigger value="recipe">📖 Recipe (Optional)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="images">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Photos</CardTitle>
                    <CardDescription>Show off your beautiful creation!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {postData.images.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-orange-200">
                          <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleAddImage}
                      className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50"
                      disabled={postData.images.length >= 4}
                    >
                      📸 Add Photo ({postData.images.length}/4)
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recipe">
                <Card>
                  <CardHeader>
                    <CardTitle>Share the Recipe</CardTitle>
                    <CardDescription>Help others recreate your delicious dish!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Prep Time (min)</Label>
                        <Input
                          type="number"
                          placeholder="15"
                          value={recipeData.prepTime}
                          onChange={(e) => setRecipeData(prev => ({ ...prev, prepTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Cook Time (min)</Label>
                        <Input
                          type="number"
                          placeholder="30"
                          value={recipeData.cookTime}
                          onChange={(e) => setRecipeData(prev => ({ ...prev, cookTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Servings</Label>
                        <Input
                          type="number"
                          placeholder="4"
                          value={recipeData.servings}
                          onChange={(e) => setRecipeData(prev => ({ ...prev, servings: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Ingredients</Label>
                      {recipeData.ingredients.map((ingredient, index) => (
                        <Input
                          key={index}
                          placeholder="e.g., 2 cups all-purpose flour"
                          value={ingredient}
                          onChange={(e) => handleIngredientChange(index, e.target.value)}
                          className="mt-2"
                        />
                      ))}
                      <Button variant="outline" onClick={handleAddIngredient} className="mt-2">
                        + Add Ingredient
                      </Button>
                    </div>

                    <div>
                      <Label>Instructions</Label>
                      {recipeData.instructions.map((instruction, index) => (
                        <Textarea
                          key={index}
                          placeholder={`Step ${index + 1}: e.g., Mix dry ingredients in a large bowl`}
                          value={instruction}
                          onChange={(e) => handleInstructionChange(index, e.target.value)}
                          className="mt-2"
                        />
                      ))}
                      <Button variant="outline" onClick={handleAddInstruction} className="mt-2">
                        + Add Step
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Step 3: Categories */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Choose Categories</CardTitle>
                <CardDescription>Help others find your recipe by selecting relevant categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={postData.categories.includes(category.id) ? "default" : "outline"}
                      className={`cursor-pointer p-3 text-center transition-colors ${
                        postData.categories.includes(category.id)
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                      }`}
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="border-orange-200"
              >
                ← Previous
              </Button>
            )}
          </div>

          <div>
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </div>
                ) : (
                  '✨ Publish Post'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};