package com.andrewslater.example;

import com.andrewslater.example.models.SystemSettings;
import com.andrewslater.example.security.SecurityUser;
import javassist.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

@ControllerAdvice
public class ExampleControllerAdvice {
    private static final Logger LOG = LoggerFactory.getLogger(ExampleControllerAdvice.class);

    @Autowired
    private SystemSettings systemSettings;

    @ModelAttribute
    public void addAttributes(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof SecurityUser) {
            model.addAttribute("principal", ((SecurityUser)auth.getPrincipal()).getUser());
        }
        model.addAttribute("systemSettings", systemSettings);
        model.addAttribute("MAPPINGS", new Mappings());

    }

    @ExceptionHandler(NoSuchRequestHandlingMethodException.class)
    public String exceptionHandler(Exception ex) {
        return "error";
//        ModelAndView mav = new ModelAndView("error");
//        mav.addObject("ex", ex);
//        mav.addObject("url", request.getRequestURL());
//        mav.addObject("timestamp", LocalDateTime.now().toString());
//        mav.addObject("status", 500);
//
//        return mav;
    }

    @ExceptionHandler(NotFoundException.class)
    public String handleCustomException(NotFoundException ex) {
        return "{\"error\": \"Resource not found\"}";

//        ModelAndView model = new ModelAndView("error/generic_error");
//        model.addObject("errCode", ex.getErrCode());
//        model.addObject("errMsg", ex.getErrMsg());
//
//        return model;

    }
}
