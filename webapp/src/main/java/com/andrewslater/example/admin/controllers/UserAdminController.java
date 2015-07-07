package com.andrewslater.example.admin.controllers;

import com.andrewslater.example.Mappings;
import com.andrewslater.example.models.User;
import com.andrewslater.example.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.andrewslater.example.admin.api.UsersAdminAPIController;
import com.andrewslater.example.admin.forms.CreateUserForm;
import com.andrewslater.example.api.resources.UserResource;
import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.react.ReactUtils;
import com.andrewslater.example.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;

@Controller
public class UserAdminController {

    private static final Logger LOG = LoggerFactory.getLogger(UserAdminController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UsersAdminAPIController usersAdminAPIController;

    @Autowired
    private SystemSettings systemSettings;

    @Autowired
    private ReactUtils reactUtils;

    @Autowired
    private ObjectMapper objectMapper;

    @RequestMapping(Mappings.ADMIN_LIST_USERS)
    public String listUsers(Model model, @RequestParam(value = "page", required = false) Integer page,
                                         @RequestParam(value = "size", required = false) Integer size,
                                         @RequestParam(value = "sort", required = false) String sort) throws JsonProcessingException {
        model.addAttribute("usersListHTML", renderListUsers(usersAdminAPIController.getUsers(page, size, sort)));
        return "admin/list_users";
    }

    private String renderListUsers(HttpEntity<Page<UserResource>> usersEntity) throws JsonProcessingException {
        String json = objectMapper.writeValueAsString(usersEntity.getBody());
        return reactUtils.invokeFunction("renderListUsersServer", json);
    }

    @RequestMapping(Mappings.ADMIN_CREATE_USER)
    public String createUsers(Model model) {
        CreateUserForm form = new CreateUserForm();
        form.setRequireConfirmation(systemSettings.isRequireEmailConfirmation());
        model.addAttribute("form", form);
        return "admin/create_user";
    }

    @RequestMapping(value = Mappings.ADMIN_USER_DETAILS, method = RequestMethod.GET)
    public String viewUser(@PathVariable Long userId, Model model) {
        User user = userRepository.findOne(userId);

        if (user == null) {
            return "admin/user_not_found";
        }

        model.addAttribute(user);
        return "admin/view_user";
    }

    @RequestMapping(value = Mappings.ADMIN_CREATE_USER, method = RequestMethod.POST)
    public String createUser(@Valid @ModelAttribute("form") CreateUserForm form,
                             BindingResult bindingResult,
                             Model model) {

        User user = null;

        if (bindingResult.hasErrors()) {
            model.addAttribute("form", form);
            return "admin/create_user";
        }

        try {
            user = userService.create(form);
        } catch (DataIntegrityViolationException e) {
            LOG.warn("Exception occurred when trying to save the user, assuming duplicate email", e);
            bindingResult.reject("email.exists", "Email already exists");
            return "admin/create_user";
        }

        return "redirect:/admin/user/" + user.getUserId();
    }
}
