package com.gdssoft.oa.service.point;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.jws.WebService;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.dao.system.AppUserDao;
import com.gdssoft.oa.dao.system.SysDataTransferDao;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.system.SysDataTransfer;
import com.gdssoft.oa.model.system.SysServiceAccessLog;
import com.gdssoft.oa.model.system.SysServiceAccount;
import com.gdssoft.oa.model.system.SysServiceInterface;
import com.gdssoft.oa.model.system.SysUserAll;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.SysServiceAccessLogService;
import com.gdssoft.oa.service.system.SysServiceAccountService;
import com.gdssoft.oa.service.system.SysServiceInterfaceService;
import com.gdssoft.oa.service.system.SysUserAllService;

@WebService(endpointInterface = "com.gdssoft.oa.service.point.ReceiveArchivesService", targetNamespace = "http://point.service.oa.gdssoft.com/")
public class ReceiveArchivesServiceImpl implements ReceiveArchivesService{
	@Resource
	private SysDataTransferDao sysDataTransferDao;
	@Resource
	private AppUserDao appUserDao;
	@Resource
	private SysServiceAccountService sysServcieAccountService;
	@Resource
	private SysServiceAccessLogService sysServiceAccessLogService;
	@Resource
	private SysServiceInterfaceService sysServiceInterfaceService;
	@Resource
	private SysUserAllService sysUserAllService;
	@Resource
	private SysConfigService sysConfigService;
	private String errorMessage;
	@Override
	public String SearchUnReceiveArchives(String ReqUserName,String RepPassword,String LoginName,String Count){
		errorMessage = "";
		String result= "";
		if (StringUtils.isEmpty(Count) || Count==null) {
			Count = "99999";
		}
		checkServiceAccount(ReqUserName,RepPassword);
		if(!StringUtils.isBlank(errorMessage)){
			result = "{\"Status\": 1,\"Error_Msg\":\"" + errorMessage + "\"}";
		}else{
			StringBuffer buff = new StringBuffer("{\"Status\": 0,\"Data\":[");
			if(LoginName!=null){
				SysUserAll sysUserAll=sysUserAllService.findByUserName(LoginName);
				String schema = sysUserAll.getSysSchemaConfig().getSchemaCode();
				Long schemaId = sysUserAll.getSchemaId();
				AppUser appUser=appUserDao.findByNameAndSchema(schema, LoginName);
				List<Long> roleIds=appUserDao.findRolesByUser(schema, appUser.getUserId());
				boolean isAdmin=false;
				boolean isArchReceiver=false;
				SysConfig isArchReceiverID=sysConfigService.findDataValueByTkCkeyWithSchema(schema, "systemRoleConfig", "ArchivesReceiveRoleID");
				for(int i = 0; i < roleIds.size(); i++){
					if (roleIds.get(i).toString().equals("-1")) {
						isAdmin=true;
					}
					if (null != isArchReceiverID
					&& roleIds.get(i).toString()
							.equals(isArchReceiverID.getDataValue())) {
						isArchReceiver = true;
					}
				}
				Long depId=appUserDao.findDepIdByNameAndSchema(schema, LoginName);
				List<SysDataTransfer> list=sysDataTransferDao.getUnReceiveArchives(schema, schemaId, depId, Count,isAdmin,isArchReceiver);
				for(SysDataTransfer sysDataTransfer:list){
					buff.append("{\"sendDep\":\"").append(sysDataTransfer.getSendDep()).append("\",\"subject\":\"")
					.append(sysDataTransfer.getSubject()).append("\",\"sendDate\":\"").append(sysDataTransfer.getCreateDate())
					.append("\",\"receiveType\":\"").append(sysDataTransfer.getReceiveType()).append("\"}");
			        buff.append(",");
				}
				buff.deleteCharAt(buff.length() - 1);
			}
			buff.append("]}");
			result=buff.toString();
			recordAccessLog(ReqUserName);
		}
		return result;
	}
	private void checkServiceAccount(String userName,String password ){
		SysServiceAccount serviceAccount = sysServcieAccountService.getServiceAccount(userName);
		if(null == serviceAccount){
			errorMessage = "服务访问账号不存在";
			return;
		}
		else{
			if(!password.toLowerCase().equals(serviceAccount.getPassword().toLowerCase())){
				errorMessage = "服务访问账号密码不正确";
				return;
			}	
			serviceAccount = sysServcieAccountService.getServiceAccount(userName, "ReceiveArchivesService");
			if(null == serviceAccount){
				errorMessage = "你没有访问此服务的账号";
				return;
			}
		}
	}
	private void recordAccessLog(String userName){
		SysServiceAccessLog serviceLog = new SysServiceAccessLog();
		serviceLog.setServiceAccount(userName);
		serviceLog.setErrorMessage(errorMessage);
		serviceLog.setAccessDate(new Date());
		long status = 0;
		if(StringUtils.isBlank(errorMessage))
			status = 1;
		else
			status = 2;
		serviceLog.setStatus(status);
		SysServiceInterface serviceInterface =sysServiceInterfaceService.findServiceInterfaceByCode("ReceiveArchivesService");
		serviceLog.setSysServiceInterface(serviceInterface);
		sysServiceAccessLogService.save(serviceLog);
	}
}
