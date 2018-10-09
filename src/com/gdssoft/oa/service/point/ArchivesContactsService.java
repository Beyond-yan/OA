package com.gdssoft.oa.service.point;

import javax.jws.WebMethod;
import javax.jws.WebService;

@WebService
public interface ArchivesContactsService {
	@WebMethod
	public String SearchPublicArchives(String ReqUserName,String RepPassword,String count);
	@WebMethod
	public String SearchArchivesDetail(String ReqUserName,String RepPassword,String ArchivesId,String Schema);

}
