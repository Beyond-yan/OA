package com.gdssoft.oa.service.point;

import javax.jws.WebMethod;
import javax.jws.WebService;

@WebService
public interface ReceiveArchivesService{
	@WebMethod
	public String SearchUnReceiveArchives(String ReqUserName,String RepPassword,String LoginName,String Count);
}
