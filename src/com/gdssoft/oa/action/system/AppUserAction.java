package com.gdssoft.oa.action.system;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.Constants;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.log.Action;
import com.gdssoft.core.model.OnlineUser;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.DateUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.personal.PersonnelEmployee;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.IndexDisplay;
import com.gdssoft.oa.model.system.PanelItem;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.model.system.SysUserAll;
import com.gdssoft.oa.model.system.UserAgent;
import com.gdssoft.oa.service.info.ShortMessageService;
import com.gdssoft.oa.service.personal.PersonnelEmployeeService;
import com.gdssoft.oa.service.system.AppRoleService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.IndexDisplayService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;
import com.gdssoft.oa.service.system.SysUserAllService;
import com.gdssoft.oa.service.system.UserAgentService;
import com.gdssoft.oa.service.system.UserSubService;
import com.gdssoft.oa.util.EMailHelper;
import com.gdssoft.oa.util.IMUtil;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author csx
 * 
 */
public class AppUserAction extends BaseAction {
	private static Long SUPPER_MANAGER_ID = -1l;// 超级管理员角色ID
	@Resource
	private AppUserService appUserService;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private AppRoleService appRoleService;
	@Resource
	private UserSubService userSubService;
	@Resource
	private IndexDisplayService indexDisplayService;
	@Resource
	private UserAgentService userAgentService;
	@Resource
	private SysConfigService sysConfigService;
	@Resource
	private PersonnelEmployeeService personnelEmployeeService;
	@Resource
	private ShortMessageService shortMessageService;
	@Resource
	private SysUserAllService sysUserAllService;
	@Resource
	private SysSchemaConfigService sysSchemaConfigService;

	private AppUser appUser;

	private Long userId;

	private Long depId;

	private Long roleId;

	private String depIds;
//	private Integer limit;
//	private Integer start;
	public String findChiarManByRoleId(){
		appUser=appUserService.findChiarManByRoleId("100175");
		String name=""+appUser.getFullname();
		setJsonString(name);
		return SUCCESS;
	}
	public String findChiarManByParentId(){
		String parentId=getRequest().getParameter("parentId");
		String deptName=getRequest().getParameter("deptName");
		appUser=appUserService.findChiarManByParentId(parentId,deptName);
		String name=""+appUser.getFullname();
		setJsonString(name);
		return SUCCESS;
	}
	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String getDepIdByUserId() {
		appUser = appUserService.get(userId);
		String depId=""+appUser.getDepartment().getDepId();
		setJsonString(depId);
		return SUCCESS;
	}
	public String get() {
		AppUser appUser = null;
		JSONSerializer json = new JSONSerializer();

		if (userId != null) {
			appUser = appUserService.get(userId);
			BigDecimal decimal=new BigDecimal(1024);
			appUser.setCapacity(appUser.getCapacity().divide(decimal));
			Department dep = appUser.getDepartment();
			dep.setAppUser(null);
		} else {
			appUser = ContextUtil.getCurrentUser();
			appUser.setCapacity(appUser.getCapacity().divide(
					new BigDecimal(1024)));
			appUser = appUserService.get(appUser.getUserId());
		}

		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,totalCounts:1,data:[");
		json.transform(new DateTransformer("yyyy-MM-dd hh:mm:ss"),
				"accessionTime");
		json.transform(new DateTransformer("yyyy-MM-dd"), "attendWorkDate");
		sb.append(json.exclude(new String[] { "class" }).serialize(appUser));
		sb.append("]}");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	public String gget() {
		AppUser appUser = null;
		JSONSerializer json = JsonUtil
				.getJSONSerializer(new String[] { "accessionTime" });
		if (userId != null) {
			appUser = appUserService.get(userId);
		} else {
			json.exclude(new String[] { "accessionTime", "department",
					"password", "status", "position" });
			appUser = appUserService.get(ContextUtil.getCurrentUser()
					.getUserId());
		}

		com.gdssoft.oa.model.personal.PersonnelEmployee emp = null;

		for (com.gdssoft.oa.model.personal.PersonnelEmployee empee : appUser
				.getPersonnelEmployee()) {
			emp = empee;
			logger.info("GGG: emp: " + emp.toString());
		}

		appUser.setTmpPersonnelEmployee(emp);

		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer
				.transform(new DateTransformer("yyyy-MM-dd"), "accessionTime","birthday");
		buff.append(serializer.exclude(new String[] { "class" }).serialize(
				appUser));
		buff.append("}");
		jsonString = buff.toString();
		logger.debug("GGG DEBUG: " + jsonString);

		return SUCCESS;
	}

	public Long getDepId() {
		return depId;
	}

	public void setDepId(Long depId) {
		this.depId = depId;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public AppUser getAppUser() {
		return appUser;
	}

	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}

	public String getDepIds() {
		return depIds;
	}

	public void setDepIds(String depIds) {
		this.depIds = depIds;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public Integer getStart() {
		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	/**
	 * 显示当前用户,并且加载该用户的所有权限
	 * 
	 * @return
	 */
	public String getCurrent() {
		logger.info("-------------getCurrent()--------------------");
		AppUser currentUser = ContextUtil.getCurrentUser();
		Department curDep = currentUser.getDepartment();
		Department curDep2 = departmentService.get3LevelDept(curDep);
		if (curDep == null) {// 若所属部门为空，则设置一个缺省的部门 TODO
			curDep = new Department();
			curDep.setDepId(0l);
			curDep.setDepName(AppUtil.getCompanyName());
		}
		Iterator<String> publicIds = AppUtil.getPublicMenuIds().iterator();
		StringBuffer publicIdSb = new StringBuffer();

		while (publicIds.hasNext()) {
			publicIdSb.append(",").append(publicIds.next());
		}
		List<IndexDisplay> list = indexDisplayService.findByUser(currentUser
				.getUserId());
		List<PanelItem> items = new ArrayList<PanelItem>();
		for (IndexDisplay id : list) {
			PanelItem pi = new PanelItem();
			pi.setPanelId(id.getPortalId());
			pi.setColumn(id.getColNum());
			pi.setRow(id.getRowNum());
			items.add(pi);
		}

		// 查看当前用户时候属于食堂管理员角色
		boolean isRestrantManage = false;
		boolean isSumAdmin = false;
		boolean isArchNoAdmin= false;
		boolean isCarAdmin = false;
		boolean isOfficeDirector=false;
		boolean isOfficeDeputyDirector=false;
		boolean isGearOfficeRole = false;
		boolean isAccountManager=false;
		boolean isDocumentLoader=false;
		boolean isArchivesManager=false;
		boolean iscommonAdmin =false;
/************************moodify by:tony zhang***************************/		
//		SysConfig isSumAdminID = sysConfigService.findByKey("sumAdminRoleID");//综合管理员
		SysConfig isArchNoAdminID = sysConfigService.findByKey("ArchNoAdminRoleID");
		SysConfig isCarAdminID = sysConfigService.findByKey("carAdminRoleID");
		SysConfig isOfficeDirectorID=sysConfigService.findByKey("officeDirectorRoleID");
		SysConfig isGearOfficeRoleId = sysConfigService.findByKey("GearOfficeRoleId");
		SysConfig isOfficeDeputyDirectorID=sysConfigService.findByKey("officeDeputyDirectorRoleID");
		SysConfig isAccountManagerID=sysConfigService.findByKey("accountManagerRoleId");
		SysConfig isDocumentLoaderID=sysConfigService.findByKey("documentLoaderId");
		SysConfig isArchivesManagerID=sysConfigService.findByKey("archivesManagerID");
		SysConfig iscommonAdminID = sysConfigService.findByKey("commonAdminId");
//		SysConfig restRoleId = sysConfigService.findByKey("restaurantRoleID");
		Set<AppRole> roles = currentUser.getRoles();
		boolean isAdmin = false;
		for (AppRole role : roles) {
			// 超级管理员
			if (role.getRoleId().toString().equals("-1")) {
				isAdmin = true;
				logger.info("GGG: 当前用户具有食堂管理员角色，超级管理员");
			}
			if ((role.getRoleId().toString()
					.equals(isCarAdminID.getDataValue()))) {
				isCarAdmin = true;
				logger.info("当前用户具有车辆管理员");
			}
			if (null != isOfficeDirectorID
					&& role.getRoleId().toString()
							.equals(isOfficeDirectorID.getDataValue())) {
				isOfficeDirector = true;
				logger.info("GGG: 当前用户具有办公室处长角色");
			}
			if (null != isGearOfficeRoleId
					&& role.getRoleId().toString()
							.equals(isGearOfficeRoleId.getDataValue())) {
				isGearOfficeRole = true;
				logger.info("GGG: 当前用户具有市交委机关办公人员角色");
			}
			if (null != isOfficeDeputyDirectorID
					&& role.getRoleId().toString()
							.equals(isOfficeDeputyDirectorID.getDataValue())) {
				isOfficeDeputyDirector = true;
				logger.info("GGG: 当前用户具有办公室副处长角色");
			}
			if (null != isArchNoAdminID
					&& role.getRoleId().toString()
							.equals(isArchNoAdminID.getDataValue())) {
				isArchNoAdmin = true;
				logger.info("GGG: 当前用户具有公文编号管理员角色");
			}
			if (null != isAccountManagerID
					&& role.getRoleId().toString()
							.equals(isAccountManagerID.getDataValue())) {
				isAccountManager = true;
				logger.info("GGG: 当前用户具有账号管理员角色");
			}
			if (null != isArchivesManagerID
					&& role.getRoleId().toString()
							.equals(isArchivesManagerID.getDataValue())) {
				isArchivesManager = true;
				logger.info("当前用户具有公文管理员角色");
			}
			if ((role.getRoleId().toString()
					.equals(iscommonAdminID.getDataValue()))) {
				iscommonAdmin = true;
				logger.info("当前用户具有普通管理员");
			}
			if (null != isDocumentLoaderID
					&& role.getRoleId().toString()
							.equals(isDocumentLoaderID.getDataValue())) {
				isDocumentLoader = true;
				logger.info("GGG: 当前用户具有公文下载员角色");
			}
		}
		//
		// if (role.getRoleId().toString().equals(restRoleId.getDataValue())) {
		// isRestrantManage = true;
		// logger.info("GGG: 当前用户具有食堂管理员角色");
		// break;
		// }
		// }
		// for (AppRole role : roles) {
		// if (role.getRoleId().toString().equals(isSumAdminID.getDataValue())){
		// isSumAdmin = true;
		// logger.info("GGG: 当前用户具有综合管理员角色");
		// break;
		// }
		// }
		boolean isOfficeManager = false;// appUserService.isOfficeManager(currentUser);
		boolean isDepMonitorAdmin = false;// currentUser.getIsDepMonitorAdmin();
/***********************end****************************/
		StringBuffer sb = new StringBuffer();
		sb.append("{success:true,user:{userId:'").append(
				currentUser.getUserId());
		if (isRestrantManage == true) {
			sb.append("',isResAdmin:true");
		} else {
			sb.append("',isResAdmin:false");
		}
		sb.append(",username:'").append(currentUser.getUsername());
		sb.append("',ownerSchema:'").append(currentUser.getOwnerSchema().toLowerCase());
		sb.append("',isOfficeManager:").append(isOfficeManager);
		sb.append(",isDepMonitorAdmin:").append(isDepMonitorAdmin);
		sb.append(",isSumAdmin:").append(isSumAdmin);
		sb.append(",isArchNoAdmin:").append(isArchNoAdmin);
		sb.append(",isCarAdmin:").append(isCarAdmin);
		sb.append(",isOfficeDirector:").append(isOfficeDirector);
		sb.append(",isGearOfficeRole:").append(isGearOfficeRole);
		sb.append(",isAccountManager:").append(isAccountManager);
		sb.append(",isArchivesManager:").append(isArchivesManager);
		sb.append(",iscommonAdmin:").append(iscommonAdmin);
		sb.append(",isDocumentLoader:").append(isDocumentLoader);
		sb.append(",isOfficeDeputyDirector:").append(isOfficeDeputyDirector);
		sb.append(",isAdmin:").append(isAdmin);
		sb.append(",parentDepId:").append(curDep.getParentId());
		sb.append(",depExternal:").append(curDep.getIsExternal());
		sb.append(",fullname:'").append(currentUser.getFullname()).append(
				"',depId:'").append(curDep.getDepId()).append("',depName:'")
				.append(curDep.getDepName()).append("',deptName:'")
				.append(curDep2.getDepName()).append("',rights:'");
		sb.append(currentUser.getRights().toString().replace("[", "").replace(
				"]", ""));
		if (!"".equals(currentUser.getRights()) && publicIdSb.length() > 0) {
			sb.append(publicIdSb.toString());
		}
		Gson gson = new Gson();
		sb.append("',items:").append(gson.toJson(items).toString());
		sb.append("}}");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	public String list() {
		String isAccountManager=getRequest().getParameter("isAccountManger");
		String userPath = ContextUtil.getCurrentUser().getDepartment()
				.getPath();
		QueryFilter filter = new QueryFilter(getRequest());
		if(isAccountManager!=null&&!isAccountManager.equals("")){
			if (isAccountManager.equals("true")) {
				if (userPath != null && !userPath.equals("")) {
					filter.addFilter("Q_department.path_S_LK", userPath);
				}
			}
		}
		filter.addSorted("userlevel", "ASC");
		filter.addFilter("Q_delFlag_SN_EQ", Constants.FLAG_UNDELETED
						.toString());
		List<AppUser> list = appUserService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				new String[] { "accessionTime" });
		buff.append(serializer.exclude(new String[] { "password" }).serialize(
				list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 显示未被管理员选择当下属的用户
	 * 
	 * @return
	 */
	public String unSubUser() {
		String fullname = getRequest().getParameter("fullname");
		String userId = getRequest().getParameter("userId");
		System.out.println("~~~~~~~~~~~" + userId);
		System.out.println("~~~~~~~~~~~" + fullname);
		PagingBean pb = getInitPagingBean();

		List<AppUser> list = appUserService.getUnSubUser(new Long(userId),
				fullname, pb);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		Type type = new TypeToken<List<AppUser>>() {
		}.getType();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 显示未被某用户代理的所有账号
	 * 
	 * @return
	 */
	public String unAgent() {
		String fullname = getRequest().getParameter("fullname");
		String userId = getRequest().getParameter("userId");
		PagingBean pb = getInitPagingBean();

		List<AppUser> list = appUserService.getUnAgents(new Long(userId),
				fullname, pb);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		Type type = new TypeToken<List<AppUser>>() {
		}.getType();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	public String agent() {

		String userId = getRequest().getParameter("userId");
		System.out.println("~~~~~~~~" + userId);
		String isCombo = getRequest().getParameter("isCombo");

		List<UserAgent> list = new ArrayList<UserAgent>();

		if ("true".equals(isCombo)) {// 用于下拉
			UserAgent userAgent = new UserAgent();
			AppUser curUser = ContextUtil.getCurrentUser();

			userAgent.setGrantFullname(curUser.getFullname());
			userAgent.setGrantUId(curUser.getUserId());

			list.add(userAgent);

		}
		List<UserAgent> userAgents = userAgentService.getByUserId(new Long(
				userId));
		list.addAll(userAgents);
		Gson gson = new Gson();
		Type type = new TypeToken<List<UserAgent>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,result:");

		buff.append(gson.toJson(list, type));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}

	public String saveAgent() {
		String userId = getRequest().getParameter("userId");

		String grantUIds = getRequest().getParameter("grantUIds");
		AppUser user = appUserService.get(new Long(userId));
		userAgentService.delUserGrants(user.getUserId());
		if (StringUtils.isNotEmpty(grantUIds)) {
			String[] uIds = grantUIds.split("[,]");
			if (uIds != null) {
				for (int i = 0; i < uIds.length; i++) {
					AppUser grantUser = appUserService.get(new Long(uIds[i]));
					UserAgent userAgent = new UserAgent();
					userAgent.setFullname(user.getFullname());
					userAgent.setUserId(user.getUserId());
					userAgent.setGrantUId(grantUser.getUserId());
					userAgent.setGrantFullname(grantUser.getFullname());
					userAgent.setGrantTitle(new Integer(grantUser.getTitle()));
					userAgentService.save(userAgent);
				}
			}
		}
		setJsonString("{sucess:true}");
		return SUCCESS;
	}
	/**
	 * lxw 
	 * @return
	 */
	public String insertAgent() {
		String userId = getRequest().getParameter("userId");

		String grantUIds = getRequest().getParameter("grantUIds");
		String grantFromDateString = getRequest().getParameter("grantFromDate");
		String grantToDateString = getRequest().getParameter("grantToDate");
		Date grantFromDate = DateUtil.parseDate(grantFromDateString);
		Date grantToDate = DateUtil.parseDate(grantToDateString);
		AppUser user = appUserService.get(new Long(userId));
		//userAgentService.delUserGrants(user.getUserId());
		AppUser appUser = ContextUtil.getCurrentUser();
		
		List<UserAgent> list= userAgentService.getMySelfUserAgent(appUser);
		boolean flag =isHadExists(grantFromDate,grantToDate,list);
		if(flag){//存在
			setJsonString("{success:true,message:'error'}");
			return SUCCESS;
		}else{
			if (StringUtils.isNotEmpty(grantUIds)) {
				String[] uIds = grantUIds.split("[,]");
				if (uIds != null) {
					for (int i = 0; i < uIds.length; i++) {
						AppUser grantUser = appUserService.get(new Long(uIds[i]));
						UserAgent userAgent = new UserAgent();
						userAgent.setFullname(user.getFullname());
						userAgent.setUserId(user.getUserId());
						userAgent.setGrantUId(grantUser.getUserId());
						userAgent.setGrantFullname(grantUser.getFullname());
						userAgent.setGrantTitle(new Integer(grantUser.getTitle()));
						userAgent.setGrantFromDate(grantFromDate);
						userAgent.setGrantToDate(grantToDate);
						userAgentService.save(userAgent);
						String newMsg=user.getFullname()+"将您设为代理人";
						//添加短信息提示
						shortMessageService.save(AppUser.SYSTEM_USER,String.valueOf(grantUser.getUserId()),newMsg,ShortMessage.MSG_TYPE_SYS);
					}
				}
				
			}
			setJsonString("{sucess:true}");
			return SUCCESS;
		}
	}
	/**
	 * 判断时间段有重复 
	 * @param diary 
	 * @param diaryList 
	 * @return false 表示没有重复 true表示有重复
	 */
	public boolean isHadExists(Date grantFromDate,Date grantToDate,List<UserAgent> list){
		if(list == null) {//表示该员工今天没有写过工作日志
			return false;
		}else {//写过工作日志则进行判断是时间上是否有重叠
			//获取此新增的日志的开始时间
			long newOnDutyTime = grantFromDate.getTime();
			//获取此新增的日志的结束时间
			long newOffDutyTime = grantToDate.getTime();
			boolean flag = false;//flag 为true代表工作日志时间没有重复，如果重复则为false不保存直接返回错误信息
			for(UserAgent userAgentTemp:list){
				long onDutyTime = userAgentTemp.getGrantFromDate().getTime();
				long offDutyTime = userAgentTemp.getGrantToDate().getTime();
				//若果不在这个时间段两边则表示有重复
				if(!((newOffDutyTime<=onDutyTime)||(newOnDutyTime>=offDutyTime))){
					flag = true;
					break;
				}
			}
			return flag;
		}
	}
	/**
	 * 根据部门查找列表
	 */
	@SuppressWarnings("unchecked")
	public String select() {
		logger.info("-------------coming into select methods----------");
		PagingBean pb = getInitPagingBean();
		String strDepId = getRequest().getParameter("depId");
		String name = getRequest().getParameter("name");
		String code = getRequest().getParameter("code");
		// 表示从上级目录开始进行查找
		String path = "0.";
		appUser = ContextUtil.getCurrentUser();
		if (StringUtils.isNotEmpty(strDepId)) {
			Long depId = Long.parseLong(strDepId);
			Department dep = departmentService.get(depId);
			if (dep != null) {
				path = dep.getPath();
			}
		} else {
			Department dep = appUser.getDepartment();
			if (dep != null) {
				path = dep.getPath();
			}
		}
		List<AppUser> list = appUserService.findByDepartment(path, pb,name,code);
		// 查询总条数，用于前端翻页
		PagingBean pbAll = new PagingBean(0, 99999);
		List<AppUser> listAll = appUserService.findByDepartment(path, pbAll,name,code);
		int total=listAll.size();
//		limit = 25;//limit =20;
//		logger.info("starte:"+start);	
//		start=(start==null?0:start);		
//		logger.info("starte:"+start);
//		int endIndex = start+limit;
//		if(endIndex >listAll.size()){
//			endIndex =listAll.size();
//		}
//		list=list.subList(start, endIndex);
		logger.info("-------------list----------"+list);
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
				.append(total).append(",\"result\":");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				new String[] { "accessionTime" ,"birthday"});
		buff.append(serializer.exclude(new String[] { "password" }).serialize(
				list));
		buff.append("}");

		jsonString = buff.toString();
		logger.info("-------------jsonString----------"+jsonString);
		return SUCCESS;
	}
	
	/**
	 * 在部门中模糊查找人员
	 */
	@SuppressWarnings("unchecked")
	public String selectInDep() {
		PagingBean pb = getInitPagingBean();
		String strDepId = getRequest().getParameter("depId");
		String fullName = getRequest().getParameter("fullname");
		System.out.println("fullname:"+fullName);
		// 表示从上级目录开始进行查找
		String path = "0.";
		appUser = ContextUtil.getCurrentUser();
		if (null!=strDepId&&StringUtils.isNotEmpty(strDepId)&&!"null".equals(strDepId)) {
			Long depId = Long.parseLong(strDepId);
			Department dep = departmentService.get(depId);
			if (dep != null) {
				path = dep.getPath();
			}
		} else {
			Department dep = appUser.getDepartment();
			if (dep != null) {
				path = dep.getPath();
			}
		}
		//List<AppUser> list = appUserService.findByDepartment(path, pb);
		List<AppUser> list = appUserService.findIndep(fullName,path, pb);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				new String[] { "accessionTime" });
		buff.append(serializer.exclude(new String[] { "password" }).serialize(
				list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 根据depId和角色Id获取人员列表
	 * 
	 * @return
	 */
	public String selectByDepAndRole() {
		PagingBean pb = getInitPagingBean();
		String strDepId = getRequest().getParameter("depId");
		Long roleId = Long.valueOf(getRequest().getParameter("roleId"));
		// 表示从上级目录开始进行查找
		String path = "0.";
		appUser = ContextUtil.getCurrentUser();
		if (StringUtils.isNotEmpty(strDepId)) {
			Long depId = Long.parseLong(strDepId);
			Department dep = departmentService.get(depId);
			if (dep != null) {
				path = dep.getPath();
			}
		} else {
			Department dep = appUser.getDepartment();
			if (dep != null) {
				path = dep.getPath();
			}
		}
		List<AppUser> list = appUserService.findUserByDepandRole(roleId, depId,
				pb);
		// List<AppUser> list = appUserService.selectByDepAndRole(path,
		// pb,roleId);
		System.out.println("list:" + list);
		int pageSize = list == null ? 0 : list.size();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				new String[] { "accessionTime" });
		buff.append(serializer.exclude(new String[] { "password" }).serialize(
				list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 在线用户
	 * 
	 * @return
	 */
	public String online() {
		Map<String, OnlineUser> onlineUsers = new HashMap<String, OnlineUser>();
		Map<String, OnlineUser> onlineUsersByDep = new HashMap<String, OnlineUser>();
		Map<String, OnlineUser> onlineUsersByRole = new HashMap<String, OnlineUser>();

		onlineUsers = AppUtil.getOnlineUsers();// 获得所有在线用户

		// 按部门选择在线用户
		if (depId != null) {
			for (String sessionId : onlineUsers.keySet()) {
				OnlineUser onlineUser = new OnlineUser();
				onlineUser = onlineUsers.get(sessionId);
				// if(onlineUser.getDepId().equals(depId)){
				String path = "";
				if (!onlineUser.getUserId().equals(AppUser.SUPER_USER)) {
					path = onlineUser.getDepPath();
				}
				if (!depId.equals(new Long(0))) {
					if (java.util.regex.Pattern.compile("." + depId + ".")
							.matcher(path).find()) {
						onlineUsersByDep.put(sessionId, onlineUser);
					}
				} else {
					onlineUsersByDep.put(sessionId, onlineUser);
				}
			}
		}

		// 按角色选择在线用户
		if (roleId != null) {
			for (String sessionId : onlineUsers.keySet()) {
				OnlineUser onlineUser = new OnlineUser();
				onlineUser = onlineUsers.get(sessionId);
				if (java.util.regex.Pattern.compile("," + roleId + ",")
						.matcher(onlineUser.getRoleIds()).find()) {
					onlineUsersByRole.put(sessionId, onlineUser);
				}
			}
		}

		Type type = new TypeToken<java.util.Collection<OnlineUser>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(onlineUsers.size()).append(",result:");

		Gson gson = new Gson();
		if (depId != null) {
			buff.append(gson.toJson(onlineUsersByDep.values(), type));
		} else if (roleId != null) {
			buff.append(gson.toJson(onlineUsersByRole.values(), type));
		} else {
			buff.append(gson.toJson(onlineUsers.values(), type));
		}
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 
	 * 根据角色查询
	 */
	@SuppressWarnings("unchecked")
	public String find() {
		String strRoleId = getRequest().getParameter("roleId");
		PagingBean pb = getInitPagingBean();
		if (StringUtils.isNotEmpty(strRoleId)) {
			List<AppUser> userList = appUserService.findByRole(Long
					.parseLong(strRoleId), pb);
			Type type = new TypeToken<List<AppUser>>() {
			}.getType();
			StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
					.append(pb.getTotalItems()).append(",result:");
			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation().create();
			buff.append(gson.toJson(userList, type));
			buff.append("}");

			jsonString = buff.toString();
		} else {
			jsonString = "{success:false}";
		}
		return SUCCESS;
	}
	
	/**
	 * 
	 * 根据角色在部门中查询
	 */
	public String findByRoleInDep() {
		String strRoleId = getRequest().getParameter("roleId");
		String path = departmentService.get3LevelDept(ContextUtil.getCurrentUser().getDepartment()).getPath();
		PagingBean pb = getInitPagingBean();
		if (StringUtils.isNotEmpty(strRoleId)) {
			List<AppUser> userList = appUserService.findByRoleInDep(Long
					.parseLong(strRoleId),path, pb);
			Type type = new TypeToken<List<AppUser>>() {
			}.getType();
			StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
					.append(pb.getTotalItems()).append(",result:");
			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation().create();
			buff.append(gson.toJson(userList, type));
			buff.append("}");

			jsonString = buff.toString();
		} else {
			jsonString = "{success:false}";
		}
		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {
		String[] ids = getRequest().getParameterValues("ids");
		StringBuffer buff = new StringBuffer("{success:true");
		if (ids != null) {
			buff.append(",msg:'");
			for (String id : ids) {
				AppUser delUser = appUserService.get(new Long(id));
				AppRole superManager = appRoleService.get(SUPPER_MANAGER_ID);
				if (delUser.getRoles().contains(superManager)) {
					buff.append("员工:").append(delUser.getUsername()).append(
							"是超级管理员,不能删除!<br><br/>");
				} else if (delUser.getUserId().equals(
						ContextUtil.getCurrentUserId())) {
					buff.append("不能删除自己!<br></br>");
				} else {
					String userName = delUser.getUsername();
					delUser.setStatus(Constants.FLAG_DISABLE);
					delUser.setDelFlag(Constants.FLAG_DELETED);
					delUser.setUsername("__" + delUser.getUsername());
					appUserService.save(delUser);
					//add by:tonyzhang
					sysUserAllService.delUserByUserName(userName);
					//personnelEmployeeService.delByUserId(delUser.getUserId());

				}
			}
			buff.append("'");
		}
		buff.append("}");
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	@Action(description = "添加或保存用户信息")
	public String save() {
		String rolesIds = getRequest().getParameter("AppUserRoles");
		String[] ids = rolesIds.split(",");
		Set<AppRole> roles = new HashSet<AppRole>();
		for (String id : ids) {
			if (!"".equals(id)) {
				AppRole role = appRoleService.get(new Long(id));
				roles.add(role);
			}
		}
		
		appUser.setUserlevel(appUser.getDepartment().getDepId()*10000+appUser.getUserlevel());
		
		appUser.setRoles(roles);
		if (appUser.getUserId() != null) {
			AppUser old = appUserService.get(appUser.getUserId());
			appUser.setDelFlag(old.getDelFlag());
			appUser.setPassword(old.getPassword());
			appUser.setCapacity(old.getCapacity());
			appUser.setInUseCapacity(old.getInUseCapacity());
			appUser.setDisturb(old.getDisturb());
			appUserService.merge(appUser);
			//add by:tonyzhang
			SysUserAll userAll = sysUserAllService.findByUserName(appUser.getUsername());
			if (null != userAll) {
				userAll.setStatus(Long
						.parseLong(appUser.getStatus().toString()));
				userAll.setUpdateUser(ContextUtil.getCurrentUser()
						.getUsername());
				userAll.setUpdateDate(new Date());
				sysUserAllService.save(userAll);
			}
			setJsonString("{success:true}");
		} else {
			if (sysUserAllService.findByUserName(appUser.getUsername()) == null) {
				appUser.setDelFlag(Constants.FLAG_UNDELETED);
				appUser.setPassword(StringUtil.encryptSha256(appUser
						.getPassword()));
				SysConfig sysConfig = sysConfigService.findDataValueByTkCkey(
						"docConfig", "docSpace");
				appUser.setCapacity(new BigDecimal(sysConfig.getDataValue()));
				appUser.setInUseCapacity(new BigDecimal(0));
				appUser.setDisturb((short) 0);
				appUserService.merge(appUser);

				AppUser tau = appUserService.findByUserName(appUser
						.getUsername());
				PersonnelEmployee tp = new PersonnelEmployee();
				tp.setUserId(tau.getUserId());
				tp.setEmpCode(tau.getUsername());
				tp.setIsLeaving((short) 1);
				tp.setIsLeader((short) 0);
				tp.setIsWorktel((short) 0);

				tp.setCreateBy(ContextUtil.getCurrentUser().getUsername());
				tp.setCreateDate(new Date());

				tp.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
				tp.setUpdateDate(new Date());
				
				personnelEmployeeService.save(tp);
				
				//add by:tonyzhang
				saveSysUserAll(appUser);
				
				setJsonString("{success:true}");

			} else {
				setJsonString("{success:false,msg:'用户登录账号:"
						+ appUser.getUsername() + "已存在,请重新输入账号.'}");
			}
		}
		return SUCCESS;
	}
	/**
	 * 将账号同步至公共库
	 * @param appUser
	 */
	private void saveSysUserAll(AppUser appUser){
		SysUserAll userAll =  new SysUserAll();
		userAll.setUserName(appUser.getUsername());
		userAll.setUserPassword(appUser.getPassword());
		userAll.setStatus(Long.parseLong(appUser.getStatus().toString()));
		SysSchemaConfig schemaConfig  = null;
		schemaConfig = sysSchemaConfigService.getDefaultSchema(ContextUtil.getCurrentUser().getOwnerSchema());
		userAll.setSysSchemaConfig(schemaConfig);
		userAll.setCreateUser(ContextUtil.getCurrentUser().getUsername());
		userAll.setCreateDate(new Date());
		sysUserAllService.save(userAll);
	}

	/**
	 * 查询已有角色
	 */
	public String selectedRoles() {
		if (userId != null) {
			setAppUser(appUserService.get(userId));
			Set<AppRole> roles = appUser.getRoles();
			StringBuffer sb = new StringBuffer("[");
			for (AppRole role : roles) {
				sb.append("['" + role.getRoleId() + "','" + role.getRoleName()
						+ "'],");
			}
			sb.deleteCharAt(sb.length() - 1);
			sb.append("]");
			setJsonString(sb.toString());
		}
		return SUCCESS;
	}

	/**
	 * 查询可选角色
	 * 
	 * @return
	 */
	public String chooseRoles() {
		List<AppRole> chooseRoles = appRoleService.getAll();
		;
		if (userId != null) {
			setAppUser(appUserService.get(userId));
			Set<AppRole> selectedRoles = appUser.getRoles();
			for (AppRole role : selectedRoles) {
				chooseRoles.remove(role);
			}
		}
		StringBuffer sb = new StringBuffer("[");
		for (AppRole role : chooseRoles) {
			if (role.getStatus() != 0) {
				sb.append("['" + role.getRoleId() + "','" + role.getRoleName()
						+ "'],");
			}
		}
		sb.deleteCharAt(sb.length() - 1);
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	/**
	 * 修改密码
	 * 
	 * @return
	 */
	@Action(description = "修改密码")
	public String resetPassword() {
		String userId = getRequest().getParameter("appUserUserId");
		String oldPassword = StringUtil.encryptSha256(getRequest()
				.getParameter("oldPassword"));
		String newPassword = getRequest().getParameter("newPassword");
		String againPassword = getRequest().getParameter("againPassword");
		if (StringUtils.isNotEmpty(userId)) {
			setAppUser(appUserService.get(new Long(userId)));
		} else {
			setAppUser(ContextUtil.getCurrentUser());
		}
		StringBuffer msg = new StringBuffer("{msg:'");
		boolean pass = false;
		if (oldPassword.equals(appUser.getPassword())) {
			if (newPassword.equals(againPassword)) {
				pass = true;
			} else
				msg.append("两次输入不一致.'");
		} else
			msg.append("旧密码输入不正确.'");
		if (pass) {
			appUser.setPassword(StringUtil.encryptSha256(newPassword));
			appUserService.save(appUser);
			
			//add by:tony 同步公共库密码
			SysUserAll userAll = sysUserAllService.findByUserName(appUser.getUsername());
			userAll.setUserPassword(appUser.getPassword());
			userAll.setUpdateUser(ContextUtil.getCurrentUser().getUsername());
			userAll.setUpdateDate(new Date());
			sysUserAllService.save(userAll);
			
			setJsonString("{success:true}");
		} else {
			msg.append(",failure:true}");
			setJsonString(msg.toString());
		}
		return SUCCESS;
	}

	/**
	 * 修改共享空间大小
	 * 
	 * @return
	 */
	@Action(description = "修改共享空间大小")
	public String resetCapacity() {
		// 容量增加到
		String size = getRequest().getParameter("size");
		System.out.println("--size:" + size);
		BigDecimal size2 = new BigDecimal(size).multiply(new BigDecimal(1024));
		System.out.println(size2);
		AppUser appUser = appUserService.get(this.userId);
		BigDecimal capacity = appUser.getCapacity();
		// 取得用户已经使用的空间大小
		BigDecimal inUseCapacity = appUser.getInUseCapacity();
		// 计算剩余空间大小
		// BigDecimal laveCapacity =
		// capacity.subtract(inUseCapacity).multiply(new BigDecimal(1024));
		if (size2.compareTo(inUseCapacity) < 0) {
			setJsonString("{success:true,msg:'error'}");
		} else {

			appUser.setCapacity(size2);
			appUserService.merge(appUser);
			setJsonString("{success:true}");
		}
		System.out.println(getJsonString());
		return SUCCESS;
	}

	/**
	 * 重置密码
	 * 
	 * @return
	 */
	@Action(description = "重置密码")
	public String createPassword() {
		String userId = getRequest().getParameter("appUserUserId");
		String newPassword = getRequest().getParameter("newpassword");
		String password = getRequest().getParameter("password");
		StringBuffer msg = new StringBuffer("{msg:'");
		if (StringUtils.isNotEmpty(userId)) {
			setAppUser(appUserService.get(new Long(userId)));
		} else {
			setAppUser(ContextUtil.getCurrentUser());
		}

		if (newPassword.equals(password)) {
			appUser.setPassword(StringUtil.encryptSha256(newPassword));
			appUserService.save(appUser);
			//add by:tony 同步公共库密码
			SysUserAll userAll = sysUserAllService.findByUserName(appUser.getUsername());
			userAll.setUserPassword(appUser.getPassword());
			userAll.setUpdateUser(ContextUtil.getCurrentUser().getUsername());
			userAll.setUpdateDate(new Date());
			sysUserAllService.save(userAll);
			
			setJsonString("{success:true}");
		} else {
			msg.append("重置失败!,两次输入的密码不一致,请重新输入!.'");
			msg.append(",failure:true}");
			setJsonString(msg.toString());
		}

		return SUCCESS;
	}

	/**
	 * 删除用户照片
	 * 
	 * @return
	 */
	public String photo() {
		setAppUser(appUserService.get(getUserId()));
		appUser.setPhoto("");
		appUserService.save(appUser);
		return SUCCESS;
	}

	/**
	 * 按部门查找合适做下属的用户
	 * 
	 * @return
	 */
	public String subAdepartment() {
		PagingBean pb = getInitPagingBean();
		String strDepId = getRequest().getParameter("depId");
		String path = "0.";
		AppUser user = ContextUtil.getCurrentUser();
		if (StringUtils.isNotEmpty(strDepId)) {
			Long depId = Long.parseLong(strDepId);
			Department dep = departmentService.get(depId);
			if (dep != null) {
				path = dep.getPath();
			}
		} else {
			Department dep = user.getDepartment();
			if (dep != null) {
				path = dep.getPath();
			}
		}
		if ("0.".equals(path)) {
			path = null;
		}
		Long uId = user.getUserId();
		Set<Long> userIds = userSubService.findAllUpUser(uId);
		List<Long> userIdsL = userSubService.subUsers(uId);
		userIds.add(uId);
		for (Long l : userIdsL) {
			userIds.add(l);
		}
		List<AppUser> list = appUserService.findSubAppUser(path, userIds, pb);
		Type type = new TypeToken<List<AppUser>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 根据角色来选择合适做下属的用户
	 * 
	 * @return
	 */
	public String subArole() {
		String strRoleId = getRequest().getParameter("roleId");
		PagingBean pb = getInitPagingBean();
		AppUser user = ContextUtil.getCurrentUser();
		if (StringUtils.isNotEmpty(strRoleId)) {
			Long uId = user.getUserId();
			Set<Long> userIds = userSubService.findAllUpUser(uId);
			List<Long> userIdsL = userSubService.subUsers(uId);
			userIds.add(uId);
			for (Long l : userIdsL) {
				userIds.add(l);
			}
			List<AppUser> userList = appUserService.findSubAppUserByRole(
					new Long(strRoleId), userIds, pb);
			// List<AppUser>
			// userList=appUserService.findByRole(Long.parseLong(strRoleId),
			// pb);
			Type type = new TypeToken<List<AppUser>>() {
			}.getType();
			StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
					.append(pb.getTotalItems()).append(",result:");
			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation().create();
			buff.append(gson.toJson(userList, type));
			buff.append("}");
			jsonString = buff.toString();
		} else {
			jsonString = "{success:false}";
		}
		return SUCCESS;
	}

	/**
	 * 按在线查找合适当下属的用户
	 */

	public String onlineAsub() {
		Map<String, OnlineUser> onlineUsers = new HashMap<String, OnlineUser>();
		Map<String, OnlineUser> onlineUsersBySub = new HashMap<String, OnlineUser>();
		onlineUsers = AppUtil.getOnlineUsers();// 获得所有在线用户
		// 按在线用户
		AppUser user = ContextUtil.getCurrentUser();
		Long uId = user.getUserId();
		Set<Long> userIds = userSubService.findAllUpUser(uId);
		userIds.add(uId);
		List<Long> userIdsL = userSubService.subUsers(uId);
		for (Long l : userIdsL) {
			userIds.add(l);
		}
		for (String sessionId : onlineUsers.keySet()) {
			OnlineUser onlineUser = new OnlineUser();
			onlineUser = onlineUsers.get(sessionId);
			if (!userIds.contains(onlineUser.getUserId())) {
				onlineUsersBySub.put(sessionId, onlineUser);
			}
		}
		Type type = new TypeToken<java.util.Collection<OnlineUser>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(onlineUsers.size()).append(",result:");
		Gson gson = new Gson();
		buff.append(gson.toJson(onlineUsersBySub.values(), type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 上属
	 * 
	 * @return
	 */
	public String upUser() {
		List<Long> ids = userSubService.upUser(ContextUtil.getCurrentUserId());
		List<AppUser> list = new ArrayList<AppUser>();
		for (Long l : ids) {
			list.add(appUserService.get(l));
		}
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("['" + user.getUserId().toString() + "','"
					+ user.getFullname() + "'],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 当前用户修改个人资料
	 * 
	 * @return
	 */
	@Action(description = "修改个人资料")
	public String profile() {
		AppUser old = appUserService.get(ContextUtil.getCurrentUser().getUserId());
		PersonnelEmployee tmpPersonnelEmployee = appUser
				.getTmpPersonnelEmployee();
		Set<PersonnelEmployee> personnelEmployee = old.getPersonnelEmployee();
		try {
			for (PersonnelEmployee pe : personnelEmployee) {
				BeanUtil.copyNotNullProperties(pe, tmpPersonnelEmployee);
			}
			BeanUtil.copyNotNullProperties(old, appUser);
		} catch (Exception e) {
			logger.info(e);
		}
		appUserService.save(old);
		jsonString = "{success:true}";
		return SUCCESS;
	}

	/**
	 * 取得当前用户所在室的室经理 室经理角色ID 63
	 * 
	 * @return
	 */
	public String getOfficeLeaders() {
		AppUser currentUser = ContextUtil.getCurrentUser();
		Department curDep = currentUser.getDepartment();
		curDep = departmentService.getDeptByLevel(curDep, 4);
		Long roleID = new Long(63);
		List<AppUser> list = appUserService.findUserByDepandRole(roleID, curDep
				.getDepId());
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {

			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 得某科室的室经理 室经理角色ID 63
	 * 
	 * @return
	 */
	public String getOfficeManager() {
		Long roleID = new Long(63);
		System.out.println("---------depId-------" + depId);

		List<AppUser> list = appUserService.findUserByDepandRole(roleID, depId);
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
				.append(list.size()).append(",\"result\":");

		JSONSerializer serializer = new JSONSerializer();
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 获取部门下的所有室经理
	 * 
	 * @return
	 */
	public String getDepOfOfficeLeaders() {
		Long roleID = new Long(63);
		String strDepId = getRequest().getParameter("depId");
		List<AppUser> list = appUserService.selectByDepAndRole(Long
				.valueOf(strDepId), roleID);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 得某工班的工班长 工班长角色ID 65
	 * 
	 * @return
	 */
	public String getClassManager() {
		Long roleID = new Long(64);
		System.out.println("---------depId-------" + depId);
		List<AppUser> list = appUserService.findUserByDepandRole(roleID, depId);
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
				.append(list.size()).append(",\"result\":");
		JSONSerializer serializer = new JSONSerializer();
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		
		jsonString = buff.toString();
		return SUCCESS;
	} 

	/**
	 * 取得当前用户所在部门的主管 部门主管角色ID 23
	 * 
	 * @return
	 */
	public String getLeaders() {
		String depId = getRequest().getParameter("depId");
		Long deparId;
		if(depId==null||depId.equals("")){
			AppUser currentUser = ContextUtil.getCurrentUser();
			Department curDep = currentUser.getDepartment();
			curDep = departmentService.get3LevelDept(curDep);
			deparId=curDep.getDepId();
		}else{
			deparId=new Long(depId);
		}
		Long roleID = new Long(23);
		List<AppUser> list = appUserService.findUserByDepandRole(roleID,deparId);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}
	public String getmember() {
		String depId = getRequest().getParameter("depId");
		Long deparId;
		if(depId==null||depId.equals("")){
			AppUser currentUser = ContextUtil.getCurrentUser();
			Department curDep = currentUser.getDepartment();
			curDep = departmentService.get3LevelDept(curDep);
			deparId=curDep.getDepId();
		}else{
			deparId=new Long(depId);
		};
		List<AppUser> list = appUserService.findByDepId(deparId);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 获取多个部门的正部长用逗号隔开
	 * 
	 * @return
	 */
	public String getDeptsOfLeaders() {
		String huiQiandepIds = getRequest().getParameter("huiQiandepIds");
		String[] huiQiandepIdsArray = huiQiandepIds.split(",");
		String flowAssignIds = getFlowAssignIdList(huiQiandepIdsArray, roleId);
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"flowAssignIds\":")
				.append("\"").append(flowAssignIds).append("\"").append("}");
		jsonString = buff.toString();
		return SUCCESS;

	}

	public String getFlowAssignIdList(String[] recDepIdsArray, Long roleId) {

		String flowAssignIdTemp = "";
		StringBuilder sb = new StringBuilder();
		// 查询每个部门下面的特定角色人员
		for (int i = 0; i < recDepIdsArray.length; i++) {
			List<AppUser> appUserList = appUserService.selectByDepAndRole(Long
					.valueOf(recDepIdsArray[i]), roleId);
			if (null != appUserList) {
				for (AppUser au : appUserList) {
					sb.append(au.getUserId()).append(",");
				}
			}
		}
		if (sb.length() > 0) {
			logger.info("flowAssignIdTemp1:" + sb.toString());
			flowAssignIdTemp = sb.toString().substring(0,
					sb.toString().length() - 1);
		}
		logger.info("flowAssignIdTemp:" + flowAssignIdTemp);
		return flowAssignIdTemp;
	}

	/**
	 * 获取部门所有综合管理员
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getInterManager() {
		String depId = getRequest().getParameter("depId");
		Long roleID = new Long(24);
		List<AppUser> list = appUserService.selectByDepAndRole(
				new Long(depId),roleID);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 获取部门所有预算管理员
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getBudgetManager() {
		String depId = getRequest().getParameter("depId");
		Long roleID = new Long(81);
		List<AppUser> list = appUserService.selectByDepAndRole(
				new Long(depId),roleID);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 获取分管领导 分管领导角色ID 27
	 */
	@SuppressWarnings("unchecked")
	public String getViceGenMag() {
		Long roleID = new Long(27);
		List<AppUser> list = appUserService.findByRoleId(roleID);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 获取总经理 总经理角色ID 26
	 */
	public String getGenMag() {
		Long roleID = new Long(26);
		List<AppUser> list = appUserService.findByRoleId(roleID);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 获取公司收发文负责人 公司收发文负责人 29
	 */
	public String getSeRePer() {
		Long roleID = new Long(29);
		List<AppUser> list = appUserService.findByRoleId(roleID);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 获取财务部会计人员 74
	 */
	public String getAccountant() {
		Long roleID = new Long(82);
		List<AppUser> list = appUserService.findByRoleId(roleID);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}
	 //根据角色来获取用户
	public String getUserByRoleId() {
		String roleId=getRequest().getParameter("roleId");
		List<AppUser> list = appUserService.findByRoleId(new Long(roleId));
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : list) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	/**
	 * 根据用户ID获取用户姓名
	 */
	public String getUserName() {

		String memberId = getRequest().getParameter("memberId");
		String nameType = getRequest().getParameter("nameType");
		AppUser appUser = null;
		String returnUserName = "";

		if (nameType.equals("1")) {
			appUser = appUserService.get(new Long(memberId));
			returnUserName = appUser.getFullname();

		} else if (nameType.equals("2")) {
			String[] arrayMemberId = memberId.split(",");

			for (int i = 0; i < arrayMemberId.length; i++) {
				appUser = appUserService.get(new Long(arrayMemberId[i]));
				if (i == 0) {
					returnUserName = returnUserName + appUser.getFullname();
				} else {
					returnUserName = returnUserName + ","
							+ appUser.getFullname();
				}
			}
		}

		StringBuffer sb = new StringBuffer("{success:true,data:");
		Gson gson = new Gson();
		sb.append(gson.toJson(returnUserName));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;

	}

	public String getDeptsUser() {
		PagingBean pb = getInitPagingBean();
		System.out.println("-----------------depIds-------------------------"
				+ depIds);
		String dids[] = depIds.split(",");

		List<AppUser> list = new ArrayList<AppUser>();

		for (String did : dids) {
			List<AppUser> li = appUserService.getDeptsUser(new Long(did), "",
					pb);
			list.addAll(li);
		}
		System.out.println("------listsize:" + list.size());
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(list.size()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				new String[] { "accessionTime" });
		buff.append(serializer.exclude(new String[] { "password" }).serialize(
				list));
		buff.append("}");

		jsonString = buff.toString();

		jsonString = buff.toString();
		return SUCCESS;
	}

	public String getbydept() {
		QueryFilter filter = new QueryFilter(getRequest());
		Long did = 0L;
		Long foodtypeid = 0L;
		String userfullname = "";
		if (getRequest().getParameter("Q_fullname_S_LK") != null) {
			userfullname = getRequest().getParameter("Q_fullname_S_LK");
		}
		if (getRequest().getParameter("Q_department.depId_L_EQ") != null) {
			did = Long.parseLong(getRequest().getParameter(
					"Q_department.depId_L_EQ"));
		}
		List<AppUser> list = new ArrayList<AppUser>();
		list = appUserService.getDeptsUser(did, userfullname, filter
				.getPagingBean());
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(list.size()).append(",result:");

		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"),
				new String[] { "accessionTime" });
		buff.append(serializer.exclude(new String[] { "password" }).serialize(
				list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}
	//根据当前用户的部门里的角色查询人员
	public String searchByRoleId(){
		String strRoleId = getRequest().getParameter("roleId");
		Long depid=ContextUtil.getCurrentUser().getDepartment().getDepId();
		//String strDepId=getRequest().getParameter("depId");
		List<AppUser> userList = appUserService.findUserByDepandRole(new Long(strRoleId), depid);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : userList) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (userList.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}
	//根据当前用户的部门的两个角色查询人员
	public String searchByTwoRoleId(){
		String strRole1Id = getRequest().getParameter("role1Id");
		String strRole2Id = getRequest().getParameter("role2Id");
		//String strDepId=getRequest().getParameter("depId");
		Long depid=ContextUtil.getCurrentUser().getDepartment().getDepId();
		List<AppUser> user1List = appUserService.findUserByDepandRole(new Long(strRole1Id), depid);
		List<AppUser> userList = appUserService.findUserByDepandRole(new Long(strRole2Id), depid);
		userList.addAll(user1List);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : userList) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (userList.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}
	//根据当前部门获取所有用户人员
	public String getUserByCurDep(){
		Long depid=ContextUtil.getCurrentUser().getDepartment().getDepId();
		List<AppUser> userList = appUserService.findByDepId(depid);
		StringBuffer buff = new StringBuffer("[");
		for (AppUser user : userList) {
			buff.append("[\"" + user.getUserId().toString() + "\",\""
					+ user.getFullname() + "\"],");
		}
		if (userList.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	/**
	 * dep缺省当前用户所在level=3的department
	 * @return
	 */
	public String arrLeaders() {
		String depId = getRequest().getParameter("dep");
		String roles = getRequest().getParameter("roles");
		Long deparId;
		if(depId==null||depId.equals("")){
			AppUser currentUser = ContextUtil.getCurrentUser();
			Department curDep = currentUser.getDepartment();
			curDep = departmentService.get3LevelDept(curDep);
			deparId=curDep.getDepId();
		}else{
			deparId=new Long(depId);
		}
		
		StringBuffer buff = new StringBuffer("[");
		for (String role : roles.split(",")) {
			QueryFilter qf = new QueryFilter(getRequest());
			qf.addFilter("Q_department.depId_L_EQ", deparId+"");
			qf.addFilter("Q_roles.roleId_L_EQ", role);
			List<AppUser> list = appUserService.getAll(qf);
			for (AppUser appUser : list) {
				buff.append("[\"" + appUser.getUserId() + "\",\""+ appUser.getFullname()+ "\"],");
			}
		}
	
		if (buff.length() > 2) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/**
	 * 根据主办部门获得内勤人员
	 * by刘思岑
	 * @return
	 */
	public String getInnersByDepIds(){
		String depIds = getRequest().getParameter("depIds");
		Map<Long,String> map = new HashMap<Long,String>();
		if(depIds!=null&&!depIds.equals("")){
			for (String depId : depIds.split(",")) {
				List<AppUser> userList=appUserService.findUserByDepandRole((long) 1201163, new Long(depId));
				for (AppUser user : userList) {
					map.put(user.getUserId(), user.getFullname());
				}
			}
		}
		StringBuffer buff = new StringBuffer("[");
		for (Iterator<Long> it = map.keySet().iterator();it.hasNext();) {
			Long userId = it.next();
			buff.append("[\"" + userId + "\",\""+ map.get(userId) + "\"],");
		}
		if (map.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	/**
	 * 根据部门获取部门人员列表
	 * 
	 */
	public String getByDepId(){
		String depId = getRequest().getParameter("depId");
		PagingBean pb = getInitPagingBean();
		StringBuffer bf = new StringBuffer("[");
		if(null != depId && "" != depId){
			List<AppUser> list = appUserService.getAppUserByDepIds(depId, pb);
			for(AppUser au : list){
				bf.append("['").append(au.getUserId()).append("','").append(au.getFullname()).append("'],");
			}
		}
		bf.deleteCharAt(bf.length()-1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
	/**
	 * 根据部门获取部门人员列表
	 * 
	 */
	public String getAllByDepId(){
		
		String depId = getRequest().getParameter("depId");
		String path = "0.";
		if(!"0".equals(depId) && StringUtils.isNotEmpty(depId)){
			path = departmentService.get(new Long(depId)).getPath();
		}
		
		PagingBean pb = getInitPagingBean();
		StringBuffer bf = new StringBuffer("[");
		if(null != depId && "" != depId){
			List<AppUser> list = appUserService.findByDepartment(path, pb);
			for(AppUser au : list){
				bf.append("['").append(au.getUserId()).append("','").append(au.getFullname()).append("'],");
			}
		}
		bf.deleteCharAt(bf.length()-1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
	/**
	 * 用当前用户的IM账号获取IM登录通行证
	 * for u-mail
	 * @return
	 */
	public String getIMPP(){
		String cun = ContextUtil.getCurrentUser().getUsername();
		setJsonString("{success:true,pp:'"+IMUtil.getPP(cun)+"'}");
		return SUCCESS;
	}
	
	/**
	 * 用当前用户的IM账号获取IM登录通行证
	 * for u-mail
	 * @return
	 */
	public String getCoreMailSession(){
		String username = getRequest().getParameter("un");
		String mid= getRequest().getParameter("mid");
		String mail = "";
		if(StringUtils.isEmpty(username)){
			mail = ContextUtil.getCurrentUser().getEmail();
		}else{
			mail = appUserService.findByUserName(username).getEmail();
		}
		String result=EMailHelper.coremail_service("login", mail);
		if(result.indexOf("webname")!=-1){
			result=result.substring(0, result.indexOf("webname")-1);
		}
		String readMailUrl = "mbox/viewmail.jsp?"+result+"&mid="+mid+"&nav_type=system&fid=1";
		try {
            readMailUrl = java.net.URLEncoder.encode(readMailUrl,"UTF-8");
        } catch (UnsupportedEncodingException e) {
            //System.out.println("UnsupportedEncodingException");
        }
		setJsonString("{success:true,pp:'"+result+"',qq:'"+readMailUrl+"'}");
		return SUCCESS;
	}
}
