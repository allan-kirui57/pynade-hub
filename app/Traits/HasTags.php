<?php
// app/Traits/HasTags.php

namespace App\Traits;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasTags
{
    /**
     * Get the model's tags.
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
            ->withTimestamps()
            ->withPivot('tag_group');
    }

    /**
     * Sync tags to the model.
     */
    public function syncTags(array $tags, string $group = 'default'): void
    {
        $tagIds = $this->prepareTagIds($tags, $group);

        $syncData = [];
        foreach ($tagIds as $id) {
            $syncData[$id] = ['tag_group' => $group];
        }

        $this->tags()->sync($syncData);
    }

    /**
     * Add tags to the model.
     */
    public function addTags(array $tags, string $group = 'default'): void
    {
        $tagIds = $this->prepareTagIds($tags, $group);

        $attachData = [];
        foreach ($tagIds as $id) {
            $attachData[$id] = ['tag_group' => $group];
        }

        $this->tags()->attach($attachData);
    }

    /**
     * Remove tags from the model.
     */
    public function removeTags(array $tags, string $group = null): void
    {
        $tagIds = $this->prepareTagIds($tags, $group);

        $query = $this->tags();

        if ($group) {
            $query->wherePivot('tag_group', $group);
        }

        $query->detach($tagIds);
    }

    /**
     * Get tags by group.
     */
    public function getTagsByGroup(string $group = 'default')
    {
        return $this->tags()->wherePivot('tag_group', $group)->get();
    }

    /**
     * Prepare tag IDs from tag names or IDs.
     */
    private function prepareTagIds(array $tags, string $group = 'default'): array
    {
        $tagIds = [];

        foreach ($tags as $tag) {
            if (is_numeric($tag)) {
                $tagIds[] = $tag;
            } else {
                $tagModel = Tag::firstOrCreate(
                    ['name' => $tag],
                    ['slug' => \Str::slug($tag), 'group' => $group]
                );
                $tagIds[] = $tagModel->id;
            }
        }

        return $tagIds;
    }
}
