package com.gdssoft.oa.action.mobile;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.AuthenticationManager;
import org.springframework.security.context.SecurityContext;
import org.springframework.security.context.SecurityContextHolder;
import org.springframework.security.providers.UsernamePasswordAuthenticationToken;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;

public class SignInAction extends BaseAction{
	@Resource
	private AppUserService userService;
	
	@Resource(name="authenticationManager")
	private AuthenticationManager authenticationManager=null; 
	
	private String username;
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	private String loginMsg;

	public String getLoginMsg() {
		return loginMsg;
	}

	public void setLoginMsg(String loginMsg) {
		this.loginMsg = loginMsg;
	}

	@Override
	public String execute() throws Exception {
		if(StringUtils.isNotEmpty(username) && StringUtils.isNotEmpty(password)){
			AppUser user=userService.findByUserName(username);
			if(user!=null){
				String enPassword=StringUtil.encryptSha256(password);
				if(enPassword.equals(user.getPassword())){
					
					UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
					SecurityContext securityContext = SecurityContextHolder.getContext();
					securityContext.setAuthentication(authenticationManager.authenticate(authRequest));
					SecurityContextHolder.setContext(securityContext);
					
					return SUCCESS;
				}else{
					loginMsg = "用户名或密码错误！";
				}
			}else{
				loginMsg = "用户名或密码错误！";
			}
		}else{
			loginMsg = "用户名或密码不能为空！";
		}
		
		return INPUT;
		
	}
}
