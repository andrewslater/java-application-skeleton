package com.andrewslater.example.ajax;

import com.andrewslater.example.OAuthServerConfiguration;
import com.andrewslater.example.security.SecurityUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/ajax")
public class TokenController {

    private static final Logger LOG = LoggerFactory.getLogger(TokenController.class);

    @Autowired
    private AuthorizationServerTokenServices tokenServices;

    @RequestMapping(value = "/token", method = RequestMethod.GET)
    public OAuth2AccessToken getToken(@AuthenticationPrincipal SecurityUser securityUser) {
        String clientId = "webapp";
        boolean approved = true;
        Set<String> scope = new HashSet<>(Arrays.asList("read", "write"));
        Set<String> resourceIds = new HashSet<>(Arrays.asList(OAuthServerConfiguration.RESTSERVICE_RESOURCE_ID));
        Set<String> responseTypes = new HashSet<>(Arrays.asList("code"));
        Map<String, String> requestParameters = new HashMap<>();
        Map<String, Serializable> extensionProperties = new HashMap<>();

        OAuth2Request oAuth2Request = new OAuth2Request(requestParameters, clientId,
            securityUser.getAuthorities(), approved, scope,
            resourceIds, null, responseTypes, extensionProperties);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(securityUser, null, securityUser.getAuthorities());
        OAuth2Authentication auth = new OAuth2Authentication(oAuth2Request, authenticationToken);
        return tokenServices.createAccessToken(auth);
    }
}
