package com.gdssoft.oa.service.point;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.jws.WebService;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.Constants;
import com.gdssoft.oa.dao.archive.ArchivesDao;
import com.gdssoft.oa.dao.archive.ArchivesDocDao;
import com.gdssoft.oa.dao.archive.ArchivesTypeDao;
import com.gdssoft.oa.dao.system.FileAttachDao;
import com.gdssoft.oa.dao.system.SysConfigDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.ArchivesType;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.SysServiceAccessLog;
import com.gdssoft.oa.model.system.SysServiceAccount;
import com.gdssoft.oa.model.system.SysServiceInterface;
import com.gdssoft.oa.service.system.SysServiceAccessLogService;
import com.gdssoft.oa.service.system.SysServiceAccountService;
import com.gdssoft.oa.service.system.SysServiceInterfaceService;

import flexjson.JSONSerializer;


@WebService(endpointInterface = "com.gdssoft.oa.service.point.ArchivesContactsService", targetNamespace = "http://point.service.oa.gdssoft.com/")
public class ArchivesContactsServiceImpl implements ArchivesContactsService{

	@Resource
	private ArchivesDao archivesDao;
	@Resource
	private ArchivesDocDao archivesDocDao;
	@Resource
	private FileAttachDao fileAttachDao;
	@Resource
	private SysConfigDao sysConfigDao;
	@Resource
	private SysServiceAccountService sysServcieAccountService;
	@Resource
	private SysServiceAccessLogService sysServiceAccessLogService;
	@Resource
	private SysServiceInterfaceService sysServiceInterfaceService;
	private String errorMessage;
	@Override
	public String SearchPublicArchives(String ReqUserName,String RepPassword,String count) {
		 errorMessage = "";
		 String result="";
		 checkServiceAccount(ReqUserName,RepPassword);
		 if(!StringUtils.isBlank(errorMessage)){
			result = "{\"Status\": 1,\"Error_Msg\":\"" + errorMessage + "\"}";
		 }else{
			 List<Archives> list=archivesDao.findPublicArchives(count);
			 StringBuffer buff = new StringBuffer("{\"Status\": 0,\"Data\":[");
			 for(Archives archives:list){
				 buff.append("{\"issueDep\":\"").append(archives.getIssueDep()).append("\",\"issueDate\":\"").append(archives.getIssueDate()).append("\",\"sources\":\"")
					.append(archives.getSources()).append("\",\"archivesId\":\"").append(archives.getArchivesId()).append("\",\"subject\":\"").append(archives.getSubject())
					.append("\"}");
			     buff.append(",");
			 }
			 buff.deleteCharAt(buff.length() - 1);// 删除最后一个","字符
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
			serviceAccount = sysServcieAccountService.getServiceAccount(userName, "ArchivesContactsService");
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
		SysServiceInterface serviceInterface =sysServiceInterfaceService.findServiceInterfaceByCode("ArchivesContactsService");
		serviceLog.setSysServiceInterface(serviceInterface);
		sysServiceAccessLogService.save(serviceLog);
	}
	@Override
	public String SearchArchivesDetail(String ReqUserName,String RepPassword,String ArchivesId,String Schema){
		String result="";
		checkServiceAccount(ReqUserName,RepPassword);
		if(!StringUtils.isBlank(errorMessage)){
			result = "{\"Status\": 1,\"Error_Msg\":\"" + errorMessage + "\"}";
		}else{
			StringBuffer buff = new StringBuffer("{\"Status\": 0,\"Data\":[");
			JSONSerializer json = new JSONSerializer();
			if(StringUtils.isNotEmpty(ArchivesId)&&ArchivesId!=null&&Schema!=null&&StringUtils.isNotEmpty(Schema)){
				Archives archives=archivesDao.getPublicArchiveDetail(ArchivesId,Schema);
				if(archives!=null){
					String hostUrl = sysConfigDao.findDataValueByTkCkeyWithSchema(
							"OA", "systemConfig", "hostUrl").getDataValue();
					if(hostUrl!=null) hostUrl=hostUrl+"attachFiles/";
					else hostUrl="attachFiles/";
					List<ArchivesDoc> archivesDocs=archivesDocDao.findByArchivesId(hostUrl,new Long(ArchivesId),Schema);
					List<FileAttach> fileAttachs=fileAttachDao.findFileAttach(hostUrl,new Long(ArchivesId),Schema);
					String IsStandard="";
					if(archives.getIsStandard()==1) IsStandard="是";
					else IsStandard="否";
					String IsPublic="";
					if(archives.getIsPublic()==1) IsPublic="是";
					else IsPublic="否";
					buff.append("{\"FlowName\":\"").append(archives.getArchChecker()).append("\",\"ArchivesNo\":\"").append(archives.getArchivesNo()).append("\",\"UrgentLevel\":\"").append(archives.getUrgentLevel())
					.append("\",\"PrivacyLevel\":\"").append(archives.getPrivacyLevel()).append("\",\"DepName\":\"").append(archives.getArchPrinter()).append("\",\"Issuer\":\"").append(archives.getIssuer())
					.append("\",\"ReviewUser\":\"").append(archives.getReviewUserName()).append("\",\"IssueDep\":\"").append(archives.getIssueDep()).append("\",\"TypeName\":\"").append(archives.getTypeName())
					.append("\",\"Sources\":\"").append(archives.getSources()).append("\",\"IsStandard\":\"").append(IsStandard).append("\",\"IsPublic\":\"").append(IsPublic)
					.append("\",\"FileCounts\":\"").append(archives.getFileCounts()).append("\",\"SendTo\":\"").append(archives.getSendTo()).append("\",\"CcTo\":\"").append(archives.getCcTo())
					.append("\",\"Subject\":\"").append(archives.getSubject()).append("\",\"Enclosure\":\"").append(archives.getEnclosure())
					.append("\",\"ArchivesDocs\":").append(json.exclude(new String[] { "class" }).serialize(archivesDocs)).append(",\"ArchivesFiles\":").append(json.exclude(new String[] { "class" }).serialize(fileAttachs)).append("}");
				}
			}
			buff.append("]}");
			result=buff.toString();
			recordAccessLog(ReqUserName);
		}
		return result;
	}
}
