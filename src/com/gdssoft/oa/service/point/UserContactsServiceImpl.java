package com.gdssoft.oa.service.point;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.jws.WebService;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.dao.system.AppUserDao;
import com.gdssoft.oa.dao.system.DepartmentDao;
import com.gdssoft.oa.dao.system.SysDepartmentConfigDao;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.SysServiceAccessLog;
import com.gdssoft.oa.model.system.SysServiceAccount;
import com.gdssoft.oa.model.system.SysServiceInterface;
import com.gdssoft.oa.service.system.SysServiceAccessLogService;
import com.gdssoft.oa.service.system.SysServiceAccountService;
import com.gdssoft.oa.service.system.SysServiceInterfaceService;

@WebService(endpointInterface = "com.gdssoft.oa.service.point.UserContactsService", targetNamespace = "http://point.service.oa.gdssoft.com/")
public class UserContactsServiceImpl implements UserContactsService{
	
	@Resource
	private SysDepartmentConfigDao sysDepartmentConfigDao;
	
	@Resource
	private AppUserDao appUserDao;
	
	@Resource
	private DepartmentDao departmentDao;
	
	@Resource
	private SysServiceAccountService sysServcieAccountService;
	@Resource
	private SysServiceAccessLogService sysServiceAccessLogService;
	@Resource
	private SysServiceInterfaceService sysServiceInterfaceService;
	private String errorMessage;
	@Override
	public String SearchUserContacts(String ReqUserName,String RepPassword, String DeptCode,String UserName,String DeptName,Date Update){
		String resultMessage = "";
		errorMessage = "";
		checkServiceAccount(ReqUserName,RepPassword);
		if(!StringUtils.isBlank(errorMessage))
			resultMessage = "{\"Status\": 1,\"Error_Msg\":\"" + errorMessage + "\"}";
		else
			resultMessage = this.getContacts(DeptCode, UserName, DeptName, Update);
		recordAccessLog(ReqUserName);
		return resultMessage;
	}
	
	private void checkServiceAccount(String userName,String password ){
		SysServiceAccount serviceAccount = sysServcieAccountService.getServiceAccount(userName);
		if(null == serviceAccount){
			errorMessage = "服务访问账号不存在";
			return;
		}
		else{
			if(!password.toLowerCase().equals(serviceAccount.getPassword().toLowerCase())){
				errorMessage = "服务访问账号不存在";
				return;
			}	
			serviceAccount = sysServcieAccountService.getServiceAccount(userName, "UserContactsService");
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
		SysServiceInterface serviceInterface =sysServiceInterfaceService.findServiceInterfaceByCode("UserContactsService");
		serviceLog.setSysServiceInterface(serviceInterface);
		//serviceLog.setServiceId(serviceInterface.getId());
		sysServiceAccessLogService.save(serviceLog);
	}
	
	private String getContacts(String deptCode, String userName, String deptName, Date update){
		String newString ="{\"Status\": \"非 0 的值\",\"Error_Msg\":\"错误信息描述\"}";
		Long deptId = new Long(0);
		StringBuffer sb1 = new StringBuffer();
		StringBuffer sb = new StringBuffer();
		if(StringUtils.isNotBlank(userName)){
			List<AppUser> list = appUserDao.findByDepAndUsername(deptCode, userName, deptName);
			for(int i = 0; i < list.size(); i++){
				if(!new Long(0).equals(list.get(i).getDepartment().getParentId())){
					List<Department> parentDep = departmentDao.findParentCode(list.get(i).getDepartment().getParentId());
					list.get(i).getDepartment().setParentDepCode(parentDep.get(0).getDepUnitCode());
				}
			}
			if(list.size()>0){
				List<Long> parentList = new ArrayList<Long>();
				Map<Long,List> userMap = new HashMap<Long,List>();
				Map<Long,StringBuffer> depMap = new HashMap<Long,StringBuffer>();
				for(int i =0; i < list.size(); i++){
					Long depId = list.get(i).getDepartment().getDepId();
					if(!userMap.containsKey(depId)){
						List<AppUser> userList = new ArrayList<AppUser>();
						userList.add(list.get(i));
						userMap.put(depId, userList);
					}else{
						userMap.get(depId).add(list.get(i));
					}
				}
				Set set = userMap.keySet();
				Iterator it = set.iterator();
				while(it.hasNext()){
					List<AppUser> userList= userMap.get(it.next());
					sb.append("{\"DeptCode:\"").append("\"" + userList.get(0).getDepartment().getDepUnitCode() + "\"")
					.append(",\"DeptName\":").append("\"" + userList.get(0).getDepartment().getDepName() + "\"")
					.append(",\"DeptLevel\":").append(userList.get(0).getDepartment().getDepLevel())
					.append(",\"ParentDeptCode\":").append("\"" + userList.get(0).getDepartment().getParentDepCode() + "\"")
					.append(",\"Phone\":").append("\""+ (null == userList.get(0).getPhone() ? "" :userList.get(0).getPhone()) + "\"")
					.append(",\"officePhone\":").append("\""+ (null == userList.get(0).getPhone() ? "" :userList.get(0).getPhone()) + "\"")
					.append(",\"Zip\":").append("\""+ (null == userList.get(0).getZip() ? "" :userList.get(0).getZip()) + "\"")
					.append(",\"Fax\":").append("\""+ (null == userList.get(0).getFax() ? "" :userList.get(0).getFax()) + "\"")
					.append(",\"AppUser\":[");
					for(int i = 0; i < userList.size(); i++){
						sb.append("{\"UserAccount\":").append("\"" + userList.get(i).getUsername() + "\"")
						.append(",\"FullName\":").append("\"" + userList.get(i).getFullname() + "\"")
						.append(",\"OfficeTel\":").append("\"" + (null == userList.get(i).getPhone() ? "" :userList.get(i).getPhone()) + "\"")
						.append(",\"MobilePhone\":").append("\""+ (null == userList.get(i).getMobile() ? "" :userList.get(i).getMobile()) + "\"")
						.append(",\"Phone\":").append("\""+ (null == userList.get(i).getPhone() ? "" :userList.get(i).getPhone()) + "\"")
						.append(",\"officePhone\":").append("\""+ (null == userList.get(i).getPhone() ? "" :userList.get(i).getPhone()) + "\"")
						.append(",\"Zip\":").append("\""+ (null == userList.get(i).getZip() ? "" :userList.get(i).getZip()) + "\"")
						.append(",\"Fax\":").append("\""+ (null == userList.get(i).getFax() ? "" :userList.get(i).getFax()) + "\"")
						.append(",\"Address\":").append("\""+ (null == userList.get(i).getAddress() ? "" :userList.get(i).getAddress()) + "\"")
						.append(",\"Email\":").append("\""+ (null == userList.get(i).getEmail() ? "" :userList.get(i).getEmail()) + "\"")
						.append(",\"Position\":").append("\"" + (null == userList.get(i).getPosition() ? "" :userList.get(i).getPosition())  + "\"},");
					}
					sb.deleteCharAt(sb.length()-1);
					sb.append("]}");
					if(!userList.get(0).getDepartment().getParentId().equals(new Long(0))){
						if(!depMap.containsKey(userList.get(0).getDepartment().getParentId())){
							depMap.put(userList.get(0).getDepartment().getParentId(), sb);
							sb = new StringBuffer();
							parentList.add(userList.get(0).getDepartment().getParentId());
						}else{
							depMap.get(userList.get(0).getDepartment().getParentId()).append(","+sb);
							sb = new StringBuffer();
						}
					}else{
						sb1 = sb.append(",");
						sb = new StringBuffer();
					}
				}
				if(sb1.length()>0) sb1.deleteCharAt(sb1.length()-1);
				newString = findParent(parentList,depMap,new StringBuffer("{\"Status\":0,\"Data\":[").append(sb1.toString())).append("]}").toString(); 
			}
		}else{
			List<Department> list = new ArrayList<Department>();
			Map<Long,StringBuffer> depMap = new HashMap<Long,StringBuffer>();
			List<Long> parentList = new ArrayList<Long>();
			
			if( StringUtils.isBlank(deptCode) && StringUtils.isBlank(deptName)){
				list = departmentDao.findByParentIdByCommon(new Long(0));
				for(int i = 0; i < list.size(); i++){
					if(!new Long(0).equals(list.get(i).getParentId())){
						List<Department> parentDep = departmentDao.findParentCode(list.get(i).getParentId());
						list.get(i).setParentDepCode(parentDep.get(0).getDepUnitCode());
					}
				}
			}else{
				list = departmentDao.findByCodeAndName(deptCode, deptName);
				for(int i = 0; i < list.size(); i++){
					if(!new Long(0).equals(list.get(i).getParentId())){
						List<Department> parentDep = departmentDao.findParentCode(list.get(i).getParentId());
						list.get(i).setParentDepCode(parentDep.get(0).getDepUnitCode());
					}
				}
			}
			if(list.size()>0){
				for(int i =0; i<list.size(); i++){
					sb.append("{\"DeptCode\":").append("\"" + list.get(i).getDepUnitCode() + "\"")
					.append(",\"DeptName\":").append("\"" + list.get(i).getDepName() + "\"")
					.append(",\"DeptLevel\":").append(list.get(i).getDepLevel())
					.append(",\"Phone\":").append("\""+ (null == list.get(i).getEamDepCode() ? "" :list.get(0).getEamDepCode()) + "\"")
					.append(",\"officePhone\":").append("\""+ (null == list.get(i).getEamDepCode() ? "" :list.get(0).getEamDepCode()) + "\"")
					.append(",\"Zip\":").append("\""+ (null == list.get(i).getEamDepCode() ? "" :list.get(0).getEamDepCode()) + "\"")
					.append(",\"Fax\":").append("\""+ (null == list.get(i).getEamDepCode() ? "" :list.get(0).getEamDepCode()) + "\"")
					.append(",\"ParentDeptCode\":").append("\"" + list.get(i).getParentDepCode() + "\"");
					String userString = findUser(list.get(i).getDepId());
					sb.append(userString);
					String depString = findDepChild(list.get(i).getDepId(),list.get(i).getDepUnitCode());
					sb.append(depString);
					sb.append("}");
					if(!list.get(i).getParentId().equals(new Long(0))){
						if(!depMap.containsKey(list.get(i).getParentId())){
							depMap.put(list.get(i).getParentId(), sb);
							sb = new StringBuffer();
							parentList.add(list.get(i).getParentId());
						}else{
							depMap.get(list.get(i).getParentId()).append(","+sb);
							sb = new StringBuffer();
						}
					}else{
						sb1 = sb1.append(sb).append(",");
						sb = new StringBuffer();
					}
				}
				if(sb1.length()>0) sb1.deleteCharAt(sb1.length()-1);
				/*sb.deleteCharAt(sb.length()-1);
				sb.append("]}");
				newString = sb.toString();*/
			}
			if( StringUtils.isBlank(deptCode) && StringUtils.isBlank(deptName)){
				newString = sb1.toString();
			}else{
				newString = findParent(parentList,depMap,new StringBuffer("{\"Status\":0,\"Data\":[").append(sb1.toString())).append("]}").toString();
			}
		}
		return newString;
	}
	
	public StringBuffer findParent(List<Long> parentList,Map<Long,StringBuffer> map, StringBuffer rootTree){
		StringBuffer newString = new StringBuffer();
		List<Department> list = departmentDao.findAllParents(parentList);
		for(int i = 0; i < list.size(); i++){
			if(!new Long(0).equals(list.get(i).getParentId())){
				List<Department> parentDep = departmentDao.findParentCode(list.get(i).getParentId());
				list.get(i).setParentDepCode(parentDep.get(0).getDepUnitCode());
			}
		}
		int level = 2;
		for(int i= 0; i<list.size(); i++){
			if(list.get(i).getDepLevel()>level){
				level = list.get(i).getDepLevel();
			}
		}
		if(2 == level){
			newString.append(rootTree);
			if(list.size() > 0){
				for(int i = 0; i<list.size(); i++){
					newString.append("{\"DeptCode\":").append("\""+ list.get(i).getDepUnitCode() + "\"")
					.append(",\"DeptName\":").append("\""+ list.get(i).getDepName() + "\"")
					.append(",\"DeptLevel\":").append("\"" + list.get(i).getDepLevel() + "\"")
					.append(",\"ParentDeptCode\":").append("\"" + list.get(i).getParentDepCode() + "\"")
					.append(",\"Children\":[").append(map.get(list.get(i).getDepId())).append("]},");
				}
				newString.deleteCharAt(newString.length()-1);
			}
		}else{
			for(int i = 0; i<list.size(); i++){
				if(list.get(i).getDepLevel().equals(new Integer(level))){
					newString.append("{\"DeptCode\":").append("\""+ list.get(i).getDepUnitCode() + "\"")
					.append(",\"DeptName\":").append("\""+ list.get(i).getDepName() + "\"")
					.append(",\"DeptLevel\":").append("\"" + list.get(i).getDepLevel() + "\"")
					.append(",\"ParentDeptCode\":").append("\"" + list.get(i).getParentDepCode() + "\"")
					.append(",\"Children\":[").append(map.get(list.get(i).getDepId())).append("]}");
					parentList.remove(list.get(i).getDepId());
					map.remove(list.get(i).getDepId());
					if(!parentList.contains(list.get(i).getParentId())){
						parentList.add(list.get(i).getParentId());
						map.put(list.get(i).getParentId(), newString);
						newString = new StringBuffer();
					}else{
						map.get(list.get(i).getParentId()).append(",").append(newString);
						newString = new StringBuffer();
					}
				}
			}
			list = new ArrayList<Department>();
			newString = this.findParent(parentList, map, rootTree);
		}
		return newString;
	}
	
	public String findDepChild(Long parentId,String parentCode){
		StringBuffer newString = new StringBuffer();
		List<Department> list = departmentDao.findByParentIdByCommon(parentId);
		for(int i = 0; i < list.size(); i++){
				list.get(i).setParentDepCode(parentCode);
		}
		if(list.size()>0){
			newString.append(",\"Children\":[");
			for(int i = 0; i<list.size(); i++){
				newString.append("{\"DeptCode\":").append("\"" + list.get(i).getDepUnitCode() + "\"")
				.append(",\"DeptName\":").append("\"" + list.get(i).getDepName() + "\"")
				.append(",\"DeptLevel\":").append(list.get(i).getDepLevel())
				.append(",\"ParentDeptCode\":").append("\"" + list.get(i).getParentDepCode() + "\"");
				String userString = findUser(list.get(i).getDepId());
				newString.append(userString);
				String depString = findDepChild(list.get(i).getDepId(),list.get(i).getDepUnitCode());
				newString.append(depString);
				newString.append("},");
			}
			newString.deleteCharAt(newString.length()-1);
			newString.append("]");
		}
		return newString.toString();
	}
	
	public String findUser(Long depId){
		StringBuffer newString = new StringBuffer();
		List<AppUser> list = appUserDao.findByDepIdForCommon(depId);
		if(list.size()>0){
			newString.append(",\"AppUser\":[");
			for(int i = 0; i<list.size(); i++){  
				newString.append("{\"UserAccount\":").append("\"" + list.get(i).getUsername() + "\"")
				.append(",\"FullName\":").append("\"" + list.get(i).getFullname() + "\"")
				.append(",\"OfficeTel\":").append("\""+ (null == list.get(i).getPhone() ? "" :list.get(i).getPhone()) + "\"")
				.append(",\"MobilePhone\":").append("\"" + (null == list.get(i).getMobile() ? "" :list.get(i).getMobile()) + "\"")
				.append(",\"Phone\":").append("\""+ (null == list.get(i).getPhone() ? "" :list.get(i).getPhone()) + "\"")
				.append(",\"officePhone\":").append("\""+ (null == list.get(i).getPhone() ? "" :list.get(i).getPhone()) + "\"")
				.append(",\"Zip\":").append("\""+ (null == list.get(i).getZip() ? "" :list.get(i).getZip()) + "\"")
				.append(",\"Fax\":").append("\""+ (null == list.get(i).getFax() ? "" :list.get(i).getFax()) + "\"")
				.append(",\"Address\":").append("\""+ (null == list.get(i).getAddress() ? "" :list.get(i).getAddress()) + "\"")
				.append(",\"Email\":").append("\"" + (null == list.get(i).getEmail() ? "" :list.get(i).getEmail()) + "\"")
				.append(",\"Position\":").append("\"" + (null == list.get(i).getPosition() ? "" :list.get(i).getPosition()) + "\"},");
			} 
			newString.deleteCharAt(newString.length()-1);
			newString.append("]");
		}
		
		return newString.toString();
	}

	
}
