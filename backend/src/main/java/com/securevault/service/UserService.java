package com.securevault.service;

import com.securevault.model.User;
import java.util.List;

public interface UserService {
    User getUserById(String id);
    List<User> getAllUsers();
}