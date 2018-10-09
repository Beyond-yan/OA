package com.gdssoft.oa.service.point;

import javax.annotation.Resource;
import javax.jws.WebService;

import org.apache.commons.lang.StringUtils;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.oa.dao.system.AppUserDao;
import com.gdssoft.oa.model.system.AppUser;
@WebService(endpointInterface = "com.gdssoft.oa.service.point.UserLoginService", targetNamespace = "http://point.service.oa.gdssoft.com/")
public class UserLoginServiceImpl  implements UserLoginService{
	@Resource
	private AppUserDao dao;
	@Override 
	public String getlogin(String username, String password) {
		AppUser	user =new AppUser();
		 String result="";
		String schema="oa";
		StringBuffer msg = new StringBuffer("{msg:'");
		Boolean login = false;
		// 验证用户是否存在
		if (!"".equals(username) && username != null) {
			user = dao.findByUsername(schema, username);
			if (user != null) {
				// 密码不为空
				if (StringUtils.isNotEmpty(password)) {
					// 密码加密
					password=StringUtil.encryptSha256(password);

					if (user.getPassword().equalsIgnoreCase(password)) {
						if (user.getStatus() == 1) {
							login = true;
						} else
							result = "{\"Status\": 1,\"Error_Msg\":\"" + "此用于已禁用" + "\"}";
						// }
					} 
					result = "{\"Status\": 1,\"Error_Msg\":\"" + "密码不正确" + "\"}";
				} else {
					result = "{\"Status\": 1,\"Error_Msg\":\"" + "密码不能为空" + "\"}";
				}
			} else
				result = "{\"Status\": 1,\"Error_Msg\":\"" + "用户不存在" + "\"}";
		}
		if(login){
			 StringBuffer buff = new StringBuffer("{\"Status\": 0,\"Data\":[");
				 buff.append("{\"userName\":\"").append(user.getUsername()).append("\",\"userId\":\"").append(user.getUserId()).append("\",\"fullname\":\"")
					.append(user.getFullname()).append("\",\"depId\":\"").append(user.getDepartment().getDepId()).append("\",\"depName\":\"").append(user.getDepartment().getDepName())
					.append("\"}");
			     buff.append(",");
			 buff.deleteCharAt(buff.length() - 1);// 删除最后一个","字符
			 buff.append("]}");
			 result=buff.toString();
		}
		return result;
	}
}
