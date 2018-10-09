package com.gdssoft.oa.service.point;

import java.util.Date;

import javax.jws.WebMethod;
import javax.jws.WebService;

@WebService
public interface UserContactsService {
 @WebMethod(operationName="getUserContacts")
 public String SearchUserContacts(String ReqUserName,String RepPassword, String DeptCode,String UserName,String DeptName,Date Update);

}
