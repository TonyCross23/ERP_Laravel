<?php

namespace App\Services;

use App\Contracts\Dao\ContactDaoInterface;
use App\Contracts\Services\ContactServiceInterface;

class ContactService implements ContactServiceInterface {
    private $contactDao;

    public function __construct(ContactDaoInterface $contactDao) {
        $this->contactDao = $contactDao;
    }

    public function getContacts(): object {
        return $this->contactDao->getContacts();
    }

    public function contactCreate(array $data): object {
        // Business logic များ (ဥပမာ- Mail ပို့ခြင်း) ကို ဒီမှာ ထည့်နိုင်သည်
        return $this->contactDao->contactCreate($data);
    }
}