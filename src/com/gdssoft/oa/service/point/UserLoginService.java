package com.gdssoft.oa.service.point;

import javax.jws.WebMethod;
import javax.jws.WebService;

import com.gdssoft.oa.model.system.AppUser;



@WebService
public interface UserLoginService {
	@WebMethod
   public	String getlogin(String username, String password);
}
