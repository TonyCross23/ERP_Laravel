<?php

namespace App\Dao;

use App\Contracts\Dao\ContactDaoInterface;
use App\Models\Contact;

class ContactDao implements ContactDaoInterface
{
    public function getContacts(): object
    {
        return Contact::orderBy('id', 'desc')->paginate(10);
    }

    public function contactCreate(array $data): object
    {
        return Contact::create($data);
    }

    public function getContactById(int $id): object
    {
        return Contact::findOrFail($id);
    }

    public function contactDelete(int $id): bool
    {
        $contact = Contact::findOrFail($id);
        return $contact->delete();
    }
}
