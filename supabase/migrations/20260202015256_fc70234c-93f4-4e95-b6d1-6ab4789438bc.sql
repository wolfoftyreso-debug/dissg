-- Add user_id column to track who created the weights
ALTER TABLE public.evaluation_weights 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Allow authenticated users to insert their own weights
CREATE POLICY "Users can insert their own weights"
ON public.evaluation_weights
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own weights
CREATE POLICY "Users can update their own weights"
ON public.evaluation_weights
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow users to delete their own weights
CREATE POLICY "Users can delete their own weights"
ON public.evaluation_weights
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_evaluation_weights_user_id 
ON public.evaluation_weights(user_id);

-- Update existing default weights to have null user_id (system defaults)
UPDATE public.evaluation_weights SET user_id = NULL WHERE user_id IS NULL;