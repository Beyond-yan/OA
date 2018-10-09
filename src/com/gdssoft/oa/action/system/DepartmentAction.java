package com.gdssoft.oa.action.system;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections.map.LinkedMap;
import org.apache.commons.lang.StringUtils;

import tebie.applib.api.a;

import com.gdssoft.core.Constants;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.oa.model.jw.JwAttachfile;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.DepartmentAll;
import com.gdssoft.oa.model.system.DepartmentL3;
import com.gdssoft.oa.model.system.Leader;
import com.gdssoft.oa.model.system.SysDepartmentConfig;
import com.gdssoft.oa.model.system.UserDepartment;
import com.gdssoft.oa.service.archive.ArchivesDepService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.CompanyService;
import com.gdssoft.oa.service.system.DepartmentAllService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.SysDepartmentConfigService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.JSONSerializer;

public class DepartmentAction extends BaseAction{

	private Department department;
	
	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}
	 
	@Resource
	private DepartmentService departmentService;
	@Resource
	private DepartmentAllService departmentAllService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private CompanyService companyService;
	@Resource
	private ArchivesDepService archivesDepService;
	@Resource
	private SysDepartmentConfigService sysDepartmentConfigService;
	@Resource
	private  SysSchemaConfigService sysSchemaConfigService;
	
	private Map<String, List<Department>> tempDepartmentListMap = new HashMap<String, List<Department>>();
	
	private Map<String, List<Department>> schemaDepartmentListMap = new HashMap<String, List<Department>>();
	
	/**
	 * 查询 所有的部门信息
	 * @param depId
	 * @return
	 */
	public String select(){
		
		String depId=getRequest().getParameter("depId");
		if(depId==null||"".equals(depId)){
			depId=ContextUtil.getCurrentUser().getDepartment().getParentId()+"";
		}
		QueryFilter filter=new QueryFilter(getRequest());
		if(StringUtils.isNotEmpty(depId)&&!"0".equals(depId)){
			department=departmentService.get(new Long(depId));
			filter.addFilter("Q_path_S_LFK", department.getPath());
		}
		filter.addFilter("Q_isExternal_N_NEQ", "3");
		filter.addSorted("departmentLevel", "asc");
		List<Department> list=departmentService.getAll(filter);
		Type type=new TypeToken<List<Department>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':").append(filter.getPagingBean().getTotalItems()).append(",result:");		
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString=buff.toString();		
		return SUCCESS;
	}
	
	/**
	 * 显示depLevel为3的所有部门下拉框显示
	 * @return
	 */
	public String select3ByCombo(){
		
		String depId=getRequest().getParameter("depId");
		QueryFilter filter=new QueryFilter(getRequest());
		if(StringUtils.isNotEmpty(depId)&&!"0".equals(depId)){
			department=departmentService.get(new Long(depId));
			filter.addFilter("Q_path_S_LFK", department.getPath());
			
		}
		filter.addFilter("Q_depLevel_N_EQ", "3");
		filter.addFilter("Q_isExternal_N_NEQ", "3");
		filter.addSorted("departmentLevel", "asc");
		List<Department> list=departmentService.getAll(filter);
		Type type=new TypeToken<List<Department>>(){}.getType();
		StringBuffer buff = new StringBuffer("[");
		for(Department dep:list){
			buff.append("['").append(dep.getDepId()).append("','")
					.append(dep.getDepName()).append("'],");
		}
		buff.deleteCharAt(buff.length()-1);
		buff.append("]");
	    this.setJsonString(buff.toString());	
		return SUCCESS;
	}
	/**
	 * 显示depLevel为3的所有部门
	 * @return
	 */
	public String select3(){
		
		String depId=getRequest().getParameter("depId");
		QueryFilter filter=new QueryFilter(getRequest());
		if(StringUtils.isNotEmpty(depId)&&!"0".equals(depId)){
			department=departmentService.get(new Long(depId));
			filter.addFilter("Q_path_S_LFK", department.getPath());
			
		}
		filter.addFilter("Q_depLevel_N_EQ", "3");
		filter.addFilter("Q_isExternal_N_NEQ", "3");
		filter.addSorted("departmentLevel", "asc");
		List<Department> list=departmentService.getAll(filter);
		Type type=new TypeToken<List<Department>>(){}.getType();
//		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':").append(filter.getPagingBean().getTotalItems()).append(",result:");		
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(filter.getPagingBean().getTotalItems()).append(",\"result\":");		

		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString=buff.toString();		
		
		return SUCCESS;
	}
	
	public String selectByDepIds(){
		List<Department> dList= new ArrayList<Department>();
		String deps = getRequest().getParameter("depIds");
		if(deps==null || deps.isEmpty()){
			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_depLevel_N_EQ", "3");
			filter.addSorted("departmentLevel", "asc");
			filter.getPagingBean().setPageSize(Integer.MAX_VALUE);
			dList = departmentService.getAll(filter);
		}else{
			for (String depId : deps.split(",")) {
				Department dep = departmentService.get(new Long(depId));
				dList.add(dep);
			}
		}
		Type type=new TypeToken<List<Department>>(){}.getType();
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(dList.size()).append(",\"result\":");		

		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(dList, type));
		buff.append("}");
		jsonString=buff.toString();
		
		
		return SUCCESS;
	}
	
	/**
	 * 查询 指定部门下的所有科室列表
	 * @return
	 */
	public String selectDepSub(){
		
		String depId=getRequest().getParameter("depId");
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_parentId_L_EQ", depId);
		filter.addFilter("Q_isExternal_N_NEQ", "3");
		filter.addSorted("departmentLevel", "asc");
		List<Department> list=departmentService.getAll(filter);
		Type type=new TypeToken<List<Department>>(){}.getType();
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":").append(filter.getPagingBean().getTotalItems()).append(",\"result\":");

		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString=buff.toString();		
		
		return SUCCESS;
	}
	
	public String listnotroot(){
		String opt=getRequest().getParameter("opt");
		String strId = getRequest().getParameter("depId");
		String isRestAdmin = getRequest().getParameter("isRestAdmin");
		Long depId = 0L;
		if (!("".equals(strId)) && (strId != null))
		{
			depId = new Long(strId);
		}
		StringBuffer buff = new StringBuffer();
		if(StringUtils.isNotEmpty(opt)){
			buff.append("[");
		}else{
			buff.append("[{id:'"+0+"',text:'"+AppUtil.getCompanyName()+"',expanded:true,children:[");
		}
		List<Department> listParent;
		if ("1".equals(isRestAdmin))//当前用户是食堂管理员or管理员
		{
			depId = 0L;
		}
		listParent=departmentService.findByParentId(depId);
		for(Department dep:listParent){
//			if (dep.getDepId() == depId)
//			{
				buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");	
				buff.append(findChild(dep.getDepId()));	
//			}
//			else
//			{
//			    buff.append(findChildFilter(dep.getDepId(),depId));								
//			}
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		if(StringUtils.isNotEmpty(opt)){
		   buff.append("]");
		}else{
			buff.append("]}]");
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	public String list(){
		String flag=getRequest().getParameter("flag");
		String opt=getRequest().getParameter("opt");
		String rootId = getRequest().getParameter("root");
		String archivesId = getRequest().getParameter("archivesId");
		StringBuffer buff = new StringBuffer();
		if(StringUtils.isNotEmpty(opt)){
			buff.append("[");
		}else{
			buff.append("[{id:'"+0+"',text:'"+AppUtil.getCompanyName()+"',expanded:true,children:[");
		}
		List<Department> listParent;
		if (StringUtils.isNotEmpty(rootId)){
			//如果有root参数(第三级部门的id)，
			//根据root参数(当前用户的所在的第三级部门的id) 获取第三级部门下设科室，工班组等部门
			try{
				if(StringUtils.isNotEmpty(archivesId)){
					List<ArchivesDep> archDepList=archivesDepService.getSentArchsByArchId(new Long(archivesId));
					StringBuffer sb = new StringBuffer();
					for(ArchivesDep ArchDep:archDepList){
						sb.append(ArchDep.getDepId()+ ",");
					}
					if(!archDepList.isEmpty()){
					sb.deleteCharAt(sb.length() - 1);
					}
					listParent=departmentService.findByParentIdAndDepIds(new Long(rootId), sb.toString());
				}else{
					Department department=departmentService.get(new Long(rootId));
					List<Department> list1=new ArrayList<Department>();
					list1.add(department);
					listParent=list1;//第三级部门的部门Id	
				}
			}
			//如果传递的第三级部门id不是一个合法的数字，则使用默认的顶层父节点
			catch(NumberFormatException ex){
				listParent=departmentService.findByParentId(new Long(0));
			}
		}else{
			//如果没有传送root参数，默认使用最顶层父节点
			listParent=departmentService.findByParentId(new Long(0));//最顶层父节点	
		}
		for(Department dep:listParent){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
		    //buff.append(findChild(dep.getDepId()));         //modify by :tony
			if(flag!=null&&"msg".equals(flag)){
				buff.append(findChild2(dep,100,100));
			}else{
				buff.append(findChild(dep,100,100));
			}
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		if(StringUtils.isNotEmpty(opt)){
		   buff.append("]");
		}else{
			buff.append("]}]");
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	public String listByDepId(){
		String opt=getRequest().getParameter("opt");
		String depId =getRequest().getParameter("depId");
		StringBuffer buff = new StringBuffer();
		
		buff.append("[");
		
		List<Department> listParent = new ArrayList<Department>();
		//listParent=departmentService.findByParentId(new Long(0),depId);//最顶层父节点
		Department dept = departmentService.get(Long.valueOf(depId));//最顶层父节点
		listParent.add(dept);
		for(Department dep:listParent){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
		    buff.append(findChild(dep.getDepId()));
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		
		buff.append("]");
		
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/**
	 * 获取部门id下的所有用户信息
	 * @return
	 */
	public String listUserByDepId(){
		String depId =getRequest().getParameter("depId");
		StringBuffer buff = new StringBuffer();
		
		buff.append("[");
		
		List<Department> listParent = new ArrayList<Department>();
		//listParent=departmentService.findByParentId(new Long(0),depId);//最顶层父节点
		Department dept = departmentService.get(Long.valueOf(depId));//最顶层父节点
		listParent.add(dept);
		for(Department dep:listParent){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
		    buff.append(findChildUser(dep.getDepId()));
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		
		buff.append("]");
		System.out.println(buff);
		setJsonString(buff.toString());
		return SUCCESS;
	}
	public String listByDepIds(){
		String opt=getRequest().getParameter("opt");
		String depIds =getRequest().getParameter("depIds");
		String[] depIdsArray=depIds.split(",");
		
		StringBuffer buff = new StringBuffer();
		
		buff.append("[");
		for(int i=0;i<depIdsArray.length;i++){
			List<Department> listParent = new ArrayList<Department>();
			Department dept = departmentService.get(Long.valueOf(depIdsArray[i]));//最顶层父节点
			listParent.add(dept);
			for(Department dep:listParent){
				buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
			    buff.append(findChild(dep.getDepId()));
			}
			 buff.append(",");
			if (!listParent.isEmpty()) {
				buff.deleteCharAt(buff.length() - 1);
		    }
		}
		
		buff.append("]");
		
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/*
	 * 寻找子根节点*/
	
	public String findChild(Long depId){
		StringBuffer buff1=new StringBuffer("");
		List<Department> list=departmentService.findByParentId(depId);
		if(list.size()==0){
			buff1.append("leaf:true},");
			return buff1.toString(); 
		}else {
			buff1.append("expanded:true,children:[");
			for(Department dep2:list){				
				buff1.append("{id:'"+dep2.getDepId()+"',text:'"+dep2.getDepName()+"',");
				buff1.append(findChild(dep2.getDepId()));
			}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			return buff1.toString();
		}
	}
	public String findChildUser(Long depId){
		StringBuffer buff1=new StringBuffer("");
		List<Department> list=departmentService.findByParentId(depId);
		List<AppUser> listUser= appUserService.findByDepId(depId);
		if(list.size()==0){
			if(listUser.size()!=0){
				buff1.append("expanded:true,children:[");
				for(AppUser user:listUser){
					buff1.append("{id:'"+user.getUserId()+"',text:'"+user.getFullname()+"',leaf:true},");
				}
				buff1.deleteCharAt(buff1.length() - 1);
				buff1.append("]},");
			}else{
				buff1.append("leaf:true},");
			}
			return buff1.toString(); 
		}else {
			buff1.append("expanded:true,children:[");
			for(Department dep2:list){				
				buff1.append("{id:'"+dep2.getDepId()+"',text:'"+dep2.getDepName()+"',");
				buff1.append(findChildUser(dep2.getDepId()));
			}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			return buff1.toString();
		}
	}
	


	
	/*
	 * 寻找子根节点,同时根据员工所在部门过滤*/
	
	public String findChildFilter(Long depId,Long pdepId){
		StringBuffer buff1=new StringBuffer("");
		List<Department> list=departmentService.findByParentId(depId);
		if(list.size()==0){
			buff1.append("leaf:true},");
			return buff1.toString(); 
		}else {
			buff1.append("expanded:true,children:[");
			for(Department dep2:list){
				if(dep2.getDepId()==pdepId)
				{
					buff1.append("{id:'"+dep2.getDepId()+"',text:'"+dep2.getDepName()+"',");
					buff1.append(findChild(dep2.getDepId()));
				}
				else
				{
					buff1.append(findChildFilter(dep2.getDepId(),pdepId));					
				}
			}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			return buff1.toString();
		}
	}	
	
	public String add(){
		
		SysDepartmentConfig sysDepartmentConfig= sysDepartmentConfigService.findByDepCode(department.getDepUnitCode());
		long searchDepId = -1;
		long depId = -1;
		if(null != sysDepartmentConfig){
			searchDepId = sysDepartmentConfig.getDepId();
			if(null != department.getDepId()){
				depId = department.getDepId();//如果department.getDepId()为null,赋值会出错，long类型不能为null
			}
		}
		if(null == sysDepartmentConfig || searchDepId == depId){
			Long parentId=department.getParentId();
			String depPath="";
			int level=0;
			if(parentId<1){
				parentId=new Long(0);
				depPath="0.";
			}else{
				depPath=departmentService.get(parentId).getPath();
				level=departmentService.get(parentId).getDepLevel();
			}
			if(level<1){
				level=1;			
			}
			department.setDepartmentLevel(department.getParentId()*10000+department.getDepartmentLevel());
			if(department.getAppUser().getUserId() == null){
				department.setAppUser(null);
			}
			department.setDepLevel(level+1);
			
			if(null == department.getIsExternal()){
				department.setIsExternal(0);//添加IsExternal默认值0;
			}
			
			departmentService.save(department);

			String schema = ContextUtil.getCurrentUser().getOwnerSchema();
			if(null != schema) department.setDepUnitCode(schema + "_" + department.getDepId());
			departmentService.save(department);
			
			if(department!=null){
			    depPath+=department.getDepId().toString()+".";
			    department.setPath(depPath);
			    departmentService.save(department);	
			    
			    //add by:tony
			    AppUser user = ContextUtil.getCurrentUser();
			    SysDepartmentConfig departmentConfig =  sysDepartmentConfigService.findByDepId(department.getDepId());
			    if(null == departmentConfig){
			    	departmentConfig = new SysDepartmentConfig();
			    	departmentConfig.setSchemaId(user.getOwnerSchemaId());
			    }
			    departmentConfig.setDepId(department.getDepId());
			    departmentConfig.setDepCode(department.getDepUnitCode());
			    departmentConfig.setDepName(department.getDepName());
			    departmentConfig.setCreateUser(user.getUsername());
			    departmentConfig.setCreateDate(new Date());
			    departmentConfig.setUpdateUser(user.getUsername());
			    departmentConfig.setUpdateDate(new Date());
			    sysDepartmentConfigService.save(departmentConfig);
			    
			    setJsonString("{success:true}");
			}else{
				 setJsonString("{success:false}");
			}
		}else{
			setJsonString("{success:false,msg:'部门编号:"
					+department.getDepCode() + "已存在,请重新输入编号.'}");
		}
		return SUCCESS;
	}
	
	public String remove(){
		PagingBean pb=getInitPagingBean();
		Long depId=Long.parseLong(getRequest().getParameter("depId"));
		Department department=departmentService.get(depId);
//		List userList=appUserService.findByDepartment(department.getPath(), pb); 20121112 xt delete
		List userList=appUserService.findByDepartment(department.getPath(), pb,"",""); //20121112 xt add
		System.out.println("depId:"+depId+";userListSize:"+userList.size());
    	if(userList.size()>0){
    		System.out.println("有人员，cannot success.");
    		setJsonString("{success:false,message:'该部门还有人员，请将人员转移后再删除部门!'}");
    		return SUCCESS;
    	}	
    	
    	List deletedUserList=appUserService.findDeletedByDepartment(department.getPath(), pb,Constants.FLAG_UNDELETED); //20121112 xt add
    	if(deletedUserList.size()>0){
    		System.out.println("有已删除人员存在，cannot success.");
    		setJsonString("{success:false,message:'该部门仍有人员，请将人员转移后再删除部门!'}");
    		return SUCCESS;
    	}
	   /* List<Department> list=departmentService.findByParentId(depId);*/
		List<Department> list=departmentService.findByPath(depId==null?"":depId.toString()); //20121112 xt	   
		System.out.println("list size:"+list.size());
	  /*  for(Department dep:list){
	    	List users=appUserService.findByDepartment(dep.getPath(), pb,"","");//20121112
	    	if(users.size()>0){
	    		System.out.println("有人员，cannot success.");
	    		setJsonString("{success:false,message:'该部门还有人员，请将人员转移后再删除部门!'}");
	    		return SUCCESS;
	    	}	    
	    }	*/ 
	    //当该部门下都没有人员的时候才能删除子部门
		AppUser user = ContextUtil.getCurrentUser();
		for (Department dep2 : list) {
			System.out.println("删除子部门..." + dep2.getDepName());
			dep2.setIsExternal(3);
			departmentService.save(dep2);
			DepartmentAll departmentAll= departmentAllService.get(dep2.getDepId());
			if(departmentAll!=null){
				departmentAll.setDepartment(dep2, user.getOwnerSchemaId());
				departmentAllService.save(departmentAll);
			}
			
			//departmentService.remove(dep2.getDepId());
			// add by: tony
/*			SysDepartmentConfig departmentConfig = sysDepartmentConfigService
					.findByDepId(department.getDepId());
			if(null != departmentConfig)
				sysDepartmentConfigService.remove(departmentConfig);*/
			System.out.println("删除子部门success.");
		}
	    System.out.println("删除父部门..."+depId);
	    department.setIsExternal(3);
		departmentService.save(department);
		DepartmentAll departmentAll= departmentAllService.get(department.getDepId());
		if(departmentAll!=null){
			departmentAll.setDepartment(department, user.getOwnerSchemaId());
			departmentAllService.save(departmentAll);
		}
		//departmentService.remove(depId); //删除点击的那个父部门
/*		SysDepartmentConfig departmentConfig = sysDepartmentConfigService
				.findByDepId(depId);
		if(null != departmentConfig)
			sysDepartmentConfigService.remove(departmentConfig);
		System.out.println("删除父部门success.");*/
	    setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String detail(){
		Long depId=Long.parseLong(getRequest().getParameter("depId"));
		setDepartment(departmentService.get(depId));
		Department department=departmentService.get(depId);
		if(department.getDepartmentLevel()!=null){
			department.setDepartmentLevel(department.getDepartmentLevel()%10000);}
			else{
				department.setDepartmentLevel(null);
			}
//		Gson gson=new Gson();
//		StringBuffer sb = new StringBuffer("{success:true,data:[");
		StringBuffer sb = new StringBuffer("{\"success\":\"true\",\"data\":[");
		JSONSerializer serializer=new JSONSerializer();
//		sb.append(gson.toJson(department));
		sb.append(serializer.exclude(new String[] { "class" }).serialize(department));
		sb.append("]}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	public String get(){
		Long depId=Long.parseLong(getRequest().getParameter("depId"));
		Department department =departmentService.get(depId);
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").excludeFieldsWithoutExposeAnnotation()
		.create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(department));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	/**
	 * 根据部门ID取得部门分管领导ID
	 * 
	 */
	public String getViceLeader(){
		Long depId = Long.parseLong(getRequest().getParameter("curUserDepId"));
		setDepartment(departmentService.get(depId));
		setJsonString("{success:true,viceLeaderId:" + department.getAppUser().getUserId().toString()+ "}");
		// System.out.println("=======VICE_LEADER_ID：" + department.getAppUser().getUserId().toString() + "=======");
		return SUCCESS;
	}
	public String getViceLeaderMobile(){
		Long depId = Long.parseLong(getRequest().getParameter("curUserDepId"));
		setDepartment(departmentService.get(depId));
		setJsonString("{\"success\":true,\"viceLeaderId\":\"" + department.getAppUser().getUserId().toString()+ "\"}");
		return SUCCESS;
	}
	/**
	 * 根据总经理
	 * 
	 */
	public String getVGenManager(){
		Long roleID=new Long(26);
		List<AppUser> list = appUserService.findByRoleId(roleID);
		Long str = null;
		if(null !=list){
			str = list.get(0).getUserId();
		}
		setJsonString("{\"success\":true,\"genManagerId\":\"" + str+ "\"}");
		return SUCCESS;
	}
	/**
	 * 获取行政部秘书
	 * 
	 */
	public String getAdOffAggregater(){
		Long roleID=new Long(28);
		List<AppUser> list = appUserService.findByRoleId(roleID);
		Long str = null;
		if(null !=list){
			str = list.get(0).getUserId();
		}
		setJsonString("{\"success\":true,\"adOffAggregaterId\":\"" + str+ "\"}");
		return SUCCESS;
	}
	
	/**
	 * Combo控件数据填写
	 * 
	 */
	public String combo(){
		QueryFilter filter = new QueryFilter(getRequest());
		filter.getPagingBean().setPageSize(99999);
		StringBuffer sb=new StringBuffer();
		AppUser appUser = ContextUtil.getCurrentUser();
		boolean isAdmin = false;
		for(AppRole role:(appUser.getRoles()).toArray(new AppRole[0]))
		{
			if (role.getRoleId() == -1L)
			{
				isAdmin = true;
				break;
			}
		}
		if (!isAdmin)
		{
			filter.addFilter("Q_depId_L_EQ", appUser.getDepartment().getDepId().toString());
		}
		List<Department> departmentList=departmentService.getAll(filter);
		sb.append("[");

		for(Department department:departmentList){
			sb.append("['").append(department.getDepId()).append("','").append(department.getDepName()).append("'],");
		}
		if(departmentList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}	
	public String comboParent(){
		QueryFilter filter = new QueryFilter(getRequest());
		filter.getPagingBean().setPageSize(99999);
		StringBuffer sb=new StringBuffer();
		AppUser appUser = ContextUtil.getCurrentUser();
		filter.addFilter("Q_parentId_L_EQ", appUser.getDepartment().getParentId().toString());
		List<Department> departmentList=departmentService.getAll(filter);
		sb.append("[");

		for(Department department:departmentList){
			sb.append("['").append(department.getDepId()).append("','").append(department.getDepName()).append("'],");
		}
		if(departmentList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}	
	public String sentListByParentId(){
		Long deptId=null;
		String depid=getRequest().getParameter("deptId");
		if(depid!=null&&!"".equals(depid)){
			deptId=new Long(depid);
		}else{
			AppUser appUser = ContextUtil.getCurrentUser();
			deptId=appUser.getDepartment().getParentId();
		}
		Department dept=departmentService.get(deptId);
		String opt=getRequest().getParameter("opt");
		StringBuffer buff = new StringBuffer();
		if(StringUtils.isNotEmpty(opt)){
			buff.append("[");
		}else{
			buff.append("[{id:'"+dept.getDepId()+"',text:'"+dept.getDepName()+"',expanded:true,children:[");
		}
		int innerLimitLevel = Constants.DepartmentLevelLimit.DEFAULT_INNER;
		int externalLimitLevel = Constants.DepartmentLevelLimit.DEFAULT_EXTERNAL;
		if(StringUtils.isNotBlank(getRequest().getParameter("innerLimitLevel")))
			innerLimitLevel = Integer.parseInt(getRequest().getParameter("innerLimitLevel"));
		if(StringUtils.isNotBlank(getRequest().getParameter("externalLimitLevel")))
			externalLimitLevel = Integer.parseInt(getRequest().getParameter("externalLimitLevel"));
		List<Department> listParent;
		listParent=departmentService.findByParentId(deptId);//最顶层父节点	
		for(Department dep:listParent){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
			buff.append(findChild(dep,innerLimitLevel,externalLimitLevel));
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		if(StringUtils.isNotEmpty(opt)){
		   buff.append("]");
		}else{
			buff.append("]}]");
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}
/**
 * 取得最上一级部门	depLevel=3
 */
	public String comboDep3(){
		QueryFilter filter = new QueryFilter(getRequest());
		StringBuffer sb=new StringBuffer();
		AppUser appUser = ContextUtil.getCurrentUser();
		boolean isAdmin = false;
		//根据当前用户角色进行过滤
		for(AppRole role:(appUser.getRoles()).toArray(new AppRole[0]))
		{
			if (role.getRoleId() == -1L)
			{
				isAdmin = true;
				break;
			}
		}
		if (!isAdmin)//非管理员用户仅显示该用户所在部门
		{
			Department curDep = appUser.getDepartment();//取得当前用户所在部门
			curDep = departmentService.get3LevelDept(curDep);//取得当前用户所在最上级部门
			filter.addFilter("Q_depId_L_EQ", curDep.getDepId().toString());
		}
		else //管理员显示所有最上级部门
		{
			filter.addFilter("Q_depLevel_N_EQ", "3");//depLevel = 3			
		}
		List<Department> departmentList=departmentService.getAll(filter);
		sb.append("[");

		for(Department department:departmentList){
			sb.append("['").append(department.getDepId()).append("','").append(department.getDepName()).append("'],");
		}
		if(departmentList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}	
	/**
	 * 取得所有最上一级部门(不判断当前用户是否是管理员权限)	depLevel=3
	 */	
	public String comboDep3All(){
		QueryFilter filter = new QueryFilter(getRequest());
		StringBuffer sb=new StringBuffer();
		AppUser appUser = ContextUtil.getCurrentUser();
		boolean isAdmin = false;
		//根据当前用户角色进行过滤
		filter.addFilter("Q_depLevel_N_EQ", "3");//depLevel = 3			
		List<Department> departmentList=departmentService.getAll(filter);
		sb.append("[");

		for(Department department:departmentList){
			sb.append("['").append(department.getDepId()).append("','").append(department.getDepName()).append("'],");
		}
		if(departmentList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	/**
	 * @author F3222507
	 * 
	 * 取得第3级部门用于填充下拉框depLevel=3
	 */	
	public String comboDep3WithAll(){
		QueryFilter filter = new QueryFilter(getRequest());
		StringBuffer sb=new StringBuffer();
		AppUser appUser = ContextUtil.getCurrentUser();
		boolean isAdmin = false;
		//根据当前用户角色进行过滤
		filter.addFilter("Q_depLevel_N_EQ", "3");//depLevel = 3			
		List<Department> departmentList=departmentService.getAll(filter);
		sb.append("[");
		sb.append("['").append("全部").append("','").append("全部").append("'],");
		for(Department department:departmentList){
			sb.append("['").append(department.getDepName()).append("','").append(department.getDepName()).append("'],");
		}
		if(departmentList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}	
	
	
	/**
	 * 取得部门综合管理员
	 * @return
	 */
	public String dep3LeadersTree(){
		//查询level=3的部门
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_depLevel_N_EQ", "3");
		filter.getPagingBean().setPageSize(Integer.MAX_VALUE);
		List<Department> dList=departmentService.getAll(filter);
		List<DepartmentL3> depList = new ArrayList<DepartmentL3>();
		
		StringBuffer buff = new StringBuffer();
		buff.append("[");
		DepartmentL3 dep1 = null;
		for(Department dep:dList){
			dep1 = new DepartmentL3();
			dep1.setDepId(dep.getDepId());
			dep1.setDepName(dep.getDepName());
			depList.add(dep1);
			
		//	List<AppUser> appUserList = new ArrayList(appUserService.selectByDepAndRole(dep.getDepId(), 23L));
			List<AppUser> appUserList = appUserService.findUserByDepandRole(23L,dep.getDepId());

			/*for(AppUser au:appUserList){
				Leader le1 = new Leader();
				le1.setUserId(au.getUserId());
				le1.setUsername(au.getFullname());
				lList.add(le1);
			}*/
			dep1.setLeaders(appUserList);
		}
		for(DepartmentL3 dep:depList){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");	
			buff.append(findChild2(dep.getLeaders(),null));	
		}
		String result = buff.toString().substring(0, buff.toString().length()-1);
		result = result+"]";
		setJsonString(result);
		System.out.println("result:"+result);
		return SUCCESS;
	}
	public String depLeadersTree(){
		List<Department> dList= new ArrayList<Department>();
		String deps = getRequest().getParameter("depIds");
		if(deps==null || deps.isEmpty()){
			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_depLevel_N_EQ", "3");
			filter.addSorted("departmentLevel", "asc");
			filter.getPagingBean().setPageSize(Integer.MAX_VALUE);
			dList = departmentService.getAll(filter);
		}else{
			for (String depId : deps.split(",")) {
				Department dep = departmentService.get(new Long(depId));
				dList.add(dep);
			}
		}
		String roles = getRequest().getParameter("roles");
		String subDeptId = getRequest().getParameter("subDeptId");//不要某一部门所传参数部门ID
		List<DepartmentL3> depList = new ArrayList<DepartmentL3>();
		List<UserDepartment> udList=departmentService.findUserDepartmentTree(deps, roles, subDeptId);
		for(Department dep:dList){
			if(subDeptId==null||subDeptId.isEmpty()||!dep.getDepId().toString().equals(subDeptId)){
				DepartmentL3 dep1 = new DepartmentL3();
				dep1.setDepId(dep.getDepId());
				dep1.setDepName(dep.getDepName());
				List<AppUser> auList = new ArrayList<AppUser>();
				for(UserDepartment ud:udList){
					if(ud.getDeptId().equals(dep.getDepId())){
						AppUser au=new AppUser();
						au.setFullname(ud.getUserName());
						au.setUserId(ud.getUserId());
						au.setDepartment(dep);
						auList.add(au);
					}
				}
				dep1.setLeaders(auList);
				depList.add(dep1);
			}
		}
		StringBuffer buff = new StringBuffer("[");
		for(DepartmentL3 dep:depList){
			String nameLK = getRequest().getParameter("nameLK");
			String childrenStr = findChild2(dep.getLeaders(),nameLK);
			
			 //filter dep children:[]
			if(!childrenStr.equals("leaf:true") && !childrenStr.equals("children:[]")){
				buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");	
				buff.append(childrenStr).append("},");
			}
		}
		
		String result = buff.toString();
		if(result.endsWith(",")){
			result = result.substring(0, buff.toString().length()-1);
		}
		setJsonString(result+"]");
		
		return SUCCESS;
	}
	/**
	 * 角色列表和、或部门列表取得对应user
	 * for cq_oa
	 * @author F3229233
	 * @return
	 */
	public String depLeadersTreeOld(){
		List<Department> dList= new ArrayList<Department>();
		String deps = getRequest().getParameter("depIds");
		if(deps==null || deps.isEmpty()){
			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_depLevel_N_EQ", "3");
			filter.addSorted("departmentLevel", "asc");
			filter.getPagingBean().setPageSize(Integer.MAX_VALUE);
			dList = departmentService.getAll(filter);
		}else{
			for (String depId : deps.split(",")) {
				Department dep = departmentService.get(new Long(depId));
				dList.add(dep);
			}
		}
		String roles = getRequest().getParameter("roles");
		String subDeptId = getRequest().getParameter("subDeptId");//不要某一部门所传参数部门ID
		List<DepartmentL3> depList = new ArrayList<DepartmentL3>();
		for(Department dep:dList){
			if(subDeptId==null||subDeptId.isEmpty()||!dep.getDepId().toString().equals(subDeptId)){
				DepartmentL3 dep1 = new DepartmentL3();
				dep1.setDepId(dep.getDepId());
				dep1.setDepName(dep.getDepName());
				
				List<AppUser> lList = new ArrayList<AppUser>();
//				if(roles==null || roles.isEmpty()){
//					lList = appUserService.findByDepId(dep.getDepId());
//				}else{
//					Map map = new LinkedMap ();
//					//去重复
//					for (String role : roles.split(",")) {
//						List<AppUser> list = appUserService.findUserByDepandRole(new Long(role),dep.getDepId());
//						for (AppUser appUser : list) {
//							map.put(appUser.getUserId(), appUser);
//						}
//					}
//					for (Iterator<Long> it = map.keySet().iterator();it.hasNext();) {
//						lList.add(map.get(it.next()));
//					}
//				}
				lList=appUserService.findUserDepartmentTree("",roles);
				dep1.setLeaders(lList);
				depList.add(dep1);
			}
		}
		StringBuffer buff = new StringBuffer("[");
		for(DepartmentL3 dep:depList){
			String nameLK = getRequest().getParameter("nameLK");
			String childrenStr = findChild2(dep.getLeaders(),nameLK);
			
			 //filter dep children:[]
			if(!childrenStr.equals("leaf:true") && !childrenStr.equals("children:[]")){
				buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");	
				buff.append(childrenStr).append("},");
			}
		}
		
		String result = buff.toString();
		if(result.endsWith(",")){
			result = result.substring(0, buff.toString().length()-1);
		}
		setJsonString(result+"]");
		
		return SUCCESS;
	}

	/**
	 * 角色列表和、或部门列表取得对应user
	 * for cq_oa
	 * @author F3229233
	 * @return
	 */
	public String depLeadersTree2(){
		List<Department> dList= new ArrayList<Department>();
		String deps = getRequest().getParameter("depIds");
		if(deps==null || deps.isEmpty()){
			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_depLevel_N_EQ", "3");
			filter.addSorted("departmentLevel", "asc");
			filter.getPagingBean().setPageSize(Integer.MAX_VALUE);
			dList = departmentService.getAll(filter);
		}else{
			for (String depId : deps.split(",")) {
				Department dep = departmentService.get(new Long(depId));
				dList.add(dep);
			}
		}
		
		String roles = getRequest().getParameter("roles");
		String subDeptId = getRequest().getParameter("subDeptId");//不要某一部门所传参数部门ID
		List<DepartmentL3> depList = new ArrayList<DepartmentL3>();
		for(Department dep:dList){
			if(subDeptId==null||subDeptId.isEmpty()||!dep.getDepId().toString().equals(subDeptId)){
				DepartmentL3 dep1 = new DepartmentL3();
				dep1.setDepId(dep.getDepId());
				dep1.setDepName(dep.getDepName());
				
				List lList = new ArrayList();
				if(roles==null || roles.isEmpty()){
					lList = appUserService.findByDepId(dep.getDepId());
				}else{
					Map map = new LinkedMap ();
					//去重复
					for (String role : roles.split(",")) {
						List<AppUser> list = appUserService.findUserByDepandRole(new Long(role),dep.getDepId());
						for (AppUser appUser : list) {
							map.put(appUser.getUserId(), appUser);
						}
					}
					for (Iterator<Long> it = map.keySet().iterator();it.hasNext();) {
						lList.add(map.get(it.next()));
					}
				}
				dep1.setLeaders(lList);
				depList.add(dep1);
			}
		}
		StringBuffer buff = new StringBuffer("[");
		for(DepartmentL3 dep:depList){
			String nameLK = getRequest().getParameter("nameLK");
			String childrenStr = findChild2(dep.getLeaders(),nameLK);
			
			 //filter dep children:[]
			if(!childrenStr.equals("leaf:true") && !childrenStr.equals("children:[]")){
				buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',checked: false,");	
				buff.append(childrenStr).append("},");
			}
		}
		
		String result = buff.toString();
		if(result.endsWith(",")){
			result = result.substring(0, buff.toString().length()-1);
		}
		setJsonString(result+"]");
		
		return SUCCESS;
	}
	
	public static String findChild2(List<AppUser> list, String nameLK){
		StringBuffer buff1=new StringBuffer("");
		
		if(list.size()==0){
			buff1.append("leaf:true");
			return buff1.toString(); 
		}else {
			boolean hasNameLK = !(nameLK == null || "".equals(nameLK));
			buff1.append("children:[");
			for(AppUser leader:list){
				if(hasNameLK){
					if(leader.getFullname().contains(nameLK)){	//filter user
						buff1.append("{id:'"+leader.getUserId()+"',text:'"+leader.getFullname()+"',depId:'" + leader.getDepartment().getDepId() + "',leaf:true,checked: false},");	
					}
				}else{
					buff1.append("{id:'"+leader.getUserId()+"',text:'"+leader.getFullname()+"',depId:'" + leader.getDepartment().getDepId() + "',leaf:true,checked: false},");
				}
			}
			
			if(buff1.charAt(buff1.length()-1)==','){
				buff1.deleteCharAt(buff1.length()-1);
			}
				
			
			buff1.append("]");
			return buff1.toString();
		}
	}
	
	/**
	 * 取得部门综合管理员Mobile
	 * @return
	 */
	public String dep3LeadersTreeMobile(){
		//查询level=3的部门
				QueryFilter filter=new QueryFilter(getRequest());
				filter.addFilter("Q_depLevel_N_EQ", "3");
				List<Department> dList=departmentService.getAll(filter);
				List<DepartmentL3> depList = new ArrayList<DepartmentL3>();
				
				StringBuffer buff = new StringBuffer();
				buff.append("[");
				DepartmentL3 dep1 = null;
				for(Department dep:dList){
					dep1 = new DepartmentL3();
					dep1.setDepId(dep.getDepId());
					dep1.setDepName(dep.getDepName());
					depList.add(dep1);
					
					List<Leader> lList = new ArrayList<Leader>();
					List<AppUser> appUserList = new ArrayList(appUserService.findUserByDepandRole(23L,dep.getDepId()));
					dep1.setLeaders(appUserList);
				}
				for(DepartmentL3 dep:depList){
					buff.append("{\"id\":\""+dep.getDepId()+"\",\"text\":\""+dep.getDepName()+"\",");	
					buff.append(findChild2Mobile(dep.getLeaders()));	
				}
				String result = buff.toString().substring(0, buff.toString().length()-1);
				result = result+"]";
				setJsonString(result);
				System.out.println("\"result\":"+result);
				return SUCCESS;
	}	
	
	public static String findChild2Mobile(List<AppUser> list){
		StringBuffer buff1=new StringBuffer("");
		
		if(list.size()==0){
			buff1.append("\"leaf\":true},");
			return buff1.toString(); 
		}else {
			buff1.append("\"children\":[");
			for(AppUser leader:list){				
				buff1.append("{\"id\":\""+leader.getUserId()+"\",\"text\":\""+leader.getFullname()+"\",\"leaf\":\"true\",\"checked\": false},");
			}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			System.out.println("==============buff1====================="+buff1.toString());
			return buff1.toString();
		}
	}
	/**
	 * 显示公文分发所有部门
	 * @return
	 */
	public String selectArchs(){
		QueryFilter filter=new QueryFilter(getRequest());
		String archivesId=getRequest().getParameter("archivesId");
		String depId=getRequest().getParameter("depId");
		List<Department> list=null;
		if(StringUtils.isNotEmpty(depId)&&!"0".equals(depId)){
			department=departmentService.get(new Long(depId));
			filter.addFilter("Q_path_S_LFK", department.getPath());
			filter.addSorted("departmentLevel", "asc");
			list=departmentService.getAll(filter);
		}else{
			String ArchDepId=getRequest().getParameter("ArchDepId");
			List<ArchivesDep> archDepList=archivesDepService.getSentArchsByArchId(new Long(archivesId));
			StringBuffer sb = new StringBuffer();
			for(ArchivesDep ArchDep:archDepList){
				sb.append(ArchDep.getDepId()+ ",");
			}
			if(!archDepList.isEmpty()){
			sb.deleteCharAt(sb.length() - 1);
			}
			list=departmentService.findSentArchDeps(new Long(ArchDepId), sb.toString(), filter.getPagingBean());
		}
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(filter.getPagingBean().getTotalItems()).append(",\"result\":");		
		Type type=new TypeToken<List<Department>>(){}.getType();
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString=buff.toString();		
		
		return SUCCESS;
	}
	/**
	 * 
	 * 寻找子根节点,Level3以上
	 * 
	 */
	public String findChild3(Long depId){
		StringBuffer buff1=new StringBuffer("");
		Department depart=departmentService.get(depId);
		List<Department> list=departmentService.findByParentId(depId);
		if(list.size()==0||depart.getDepLevel()>3){
			buff1.append("leaf:true},");
			return buff1.toString(); 
		}else {
			buff1.append("expanded:true,children:[");
			for(Department dep2:list){
				buff1.append("{id:'"+dep2.getDepId()+"',text:'"+dep2.getDepName()+"',");
				buff1.append(findChild3(dep2.getDepId()));
			}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			return buff1.toString();
		}
	}
	public String findChild2(Department depart, int innerLimitLevel,
			int externalLimitLevel) {
		StringBuffer buff1 = new StringBuffer("");
		//Department depart=departmentService.get(depId);
		if (null != depart.getIsExternal() && 0 != depart.getIsExternal()
				&& depart.getDepLevel() >= externalLimitLevel) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}
		if (null != depart.getIsExternal() && 0 == depart.getIsExternal()
				&& depart.getDepLevel() >= innerLimitLevel) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}
		
		List<Department> list = findByParentId(depart.getDepId());//departmentService.findByParentId(depart.getDepId());
		if (list.size() == 0) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}

		buff1.append("expanded:true,children:[");
		for (Department dep2 : list) {
			if(dep2.getIsExternal()!=3){
				buff1.append("{id:'" + dep2.getDepId() + "',text:'"+ dep2.getDepName() + "',");
				buff1.append(findChild(dep2,innerLimitLevel,externalLimitLevel));
			}
		}
		buff1.deleteCharAt(buff1.length() - 1);
		buff1.append("]},");
		return buff1.toString();
	}
	/**
	 * @author tony zhang
	 * @param depId
	 *            ：部门编号
	 * @param innerLimitLevel
	 *            :限定层级
	 * @param externalLimitLevel
	 *            :限定外单位层级
	 * @return
	 */
	public String findChild(Department depart, int innerLimitLevel,
			int externalLimitLevel) {
		StringBuffer buff1 = new StringBuffer("");
		AppUser user=ContextUtil.getCurrentUser();
		String schema=user.getOwnerSchema();
		if((depart.getDepName().equals("委机关")||depart.getDepName().equals("市交委"))){
			if(!schema.equals("OA")){
				buff1.append("leaf:true},");
				return buff1.toString();
			}
			Long parentDeptId=user.getDepartment().getParentId();
			Department d=departmentService.get(parentDeptId);
			if(d!=null&&!(d.getDepName().equals("委机关")||d.getDepName().equals("市交委"))){
				buff1.append("leaf:true},");
				return buff1.toString();
			}
		}
		if (null != depart.getIsExternal() && 0 != depart.getIsExternal()
				&& depart.getDepLevel() >= externalLimitLevel) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}
		if (null != depart.getIsExternal() && 0 == depart.getIsExternal()
				&& depart.getDepLevel() >= innerLimitLevel) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}
		
		List<Department> list = findByParentId(depart.getDepId());//departmentService.findByParentId(depart.getDepId());
		if (list.size() == 0) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}

		buff1.append("expanded:true,children:[");
		for (Department dep2 : list) {
			if(dep2.getIsExternal()!=3){
				buff1.append("{id:'" + dep2.getDepId() + "',text:'"+ dep2.getDepName() + "',");
				buff1.append(findChild(dep2,innerLimitLevel,externalLimitLevel));
			}
		}
		buff1.deleteCharAt(buff1.length() - 1);
		buff1.append("]},");
		return buff1.toString();

	}
	/**
	 * 在缓存中查询部门信息
	 * 解决部门加载缓慢问题
	 * @return
	 */
	private List<Department> findByParentId(long depId){
		String schema = null;
		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
			schema = ContextUtil.getCurrentUser().getOwnerSchema();
		List<Department> tempDepartmentList = null;
		if(null == tempDepartmentListMap.get(schema)) {
			tempDepartmentList = departmentService.findByDeparmentForCache();
			if (schema != null && !"".equals(schema)) {
				tempDepartmentListMap.put(schema, tempDepartmentList);
			}
		} else {
			tempDepartmentList = tempDepartmentListMap.get(schema);
			if (tempDepartmentList == null || tempDepartmentList.size() <= 0) {
				tempDepartmentList = departmentService.findByDeparmentForCache();
				if (schema != null && !"".equals(schema)) {
					tempDepartmentListMap.put(schema, tempDepartmentList);
				}
			}
		}
		List<Department> resultDepartment = new ArrayList<Department>();
		for(Department depart : tempDepartmentList){
			if(depId  == depart.getParentId())
				resultDepartment.add(depart);
		}
		tempDepartmentList.removeAll(resultDepartment);
		return resultDepartment;
	}
	
	/**
	 * 显示depLevel为3以上的所有部门
	 * @return
	 */
	public String selectLE3(){
		String depId=getRequest().getParameter("depId");
		if(StringUtils.isBlank(depId))
			depId = "0";
		QueryFilter filter=new QueryFilter(getRequest());
		department=departmentService.get(new Long(depId));
		AppUser user=ContextUtil.getCurrentUser();
		Long parentDeptId=0l;
		if(department!=null)parentDeptId=department.getParentId();
		Department d=departmentService.get(parentDeptId);
		String schema=user.getOwnerSchema();
		if(department!=null&&(department.getDepName().equals("委机关")||department.getDepName().equals("市交委"))){
			if(!schema.equals("OA")){
				filter.addFilter("Q_depId_L_EQ", depId);
			}else{
				Long pId=user.getDepartment().getParentId();
				Department d2=departmentService.get(pId);
				boolean x=d2.getDepName().equals("委机关");
				if(d2!=null&&(d2.getDepName().equals("委机关")||d2.getDepName().equals("市交委"))){
					filter.addFilter("Q_parentId_L_E", depId);
				}else{
					filter.addFilter("Q_depId_L_E", depId);
				}
			}
		}else if(d!=null&&(d.getDepName().equals("委机关")||d.getDepName().equals("市交委"))){
			if(!schema.equals("OA")){
				filter.addFilter("Q_depId_L_EQ", parentDeptId+"");
			}else{
				filter.addFilter("Q_depId_L_EQ", depId);
			}
		}else{
			filter.addFilter("Q_parentId_L_EQ", depId);
		}
		filter.addSorted("departmentLevel", "asc");
		List<Department> list = new ArrayList<Department>();
		int totalCounts = 0;
		if (null != department && department.getIsExternal() > 0 && department.getDepLevel() >= Constants.DepartmentLevelLimit.DEFAULT_EXTERNAL) {
			list.add(department);
			totalCounts = list.size();
		}
		else {
			list = departmentService.getAll(filter);
/*			if(null != department)
				list.add(0, department);*/
			totalCounts = filter.getPagingBean().getTotalItems();
		}
		Type type=new TypeToken<List<Department>>(){}.getType();
//		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':").append(filter.getPagingBean().getTotalItems()).append(",result:");		
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(totalCounts).append(",\"result\":");		

		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString=buff.toString();		
		
		return SUCCESS;
	}
	public String selectChild(){
		String depId=getRequest().getParameter("depId");
		if(StringUtils.isBlank(depId))
			depId = "0";
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_parentId_L_E", depId);
		filter.addSorted("departmentLevel", "asc");
		List<Department> list = new ArrayList<Department>();
		int totalCounts = 0;
		list = departmentService.getAll(filter);
		totalCounts = filter.getPagingBean().getTotalItems();
		Type type=new TypeToken<List<Department>>(){}.getType();
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(totalCounts).append(",\"result\":");		

		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString=buff.toString();		
		
		return SUCCESS;
	}
	/**
	 * 
	 * 显示公文分发三层选择器
	 * @return
	 */
	public String sentList(){
		String opt=getRequest().getParameter("opt");
		StringBuffer buff = new StringBuffer();
		if(StringUtils.isNotEmpty(opt)){
			buff.append("[");
		}else{
			buff.append("[{id:'"+0+"',text:'"+AppUtil.getCompanyName()+"',expanded:true,children:[");
		}
		int innerLimitLevel = Constants.DepartmentLevelLimit.DEFAULT_INNER;
		int externalLimitLevel = Constants.DepartmentLevelLimit.DEFAULT_EXTERNAL;
		if(StringUtils.isNotBlank(getRequest().getParameter("innerLimitLevel")))
			innerLimitLevel = Integer.parseInt(getRequest().getParameter("innerLimitLevel"));
		if(StringUtils.isNotBlank(getRequest().getParameter("externalLimitLevel")))
			externalLimitLevel = Integer.parseInt(getRequest().getParameter("externalLimitLevel"));
		List<Department> listParent;
		listParent=departmentService.findByParentId(new Long(0));//最顶层父节点	
		for(Department dep:listParent){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
			buff.append(findChild(dep,innerLimitLevel,externalLimitLevel));
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		if(StringUtils.isNotEmpty(opt)){
		   buff.append("]");
		}else{
			buff.append("]}]");
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	public String finddepUser(){
		String depIds=ContextUtil.getCurrentUser().getDepartment().getPath();
		StringBuffer buff = new StringBuffer();
		if (depIds != null && !depIds.equals("")) {
			String[] arrayList = depIds.split("\\.");
			buff.append("[{id:'" + 0 + "',text:'" + AppUtil.getCompanyName());
				for (String id:arrayList) {
					if(Long.valueOf(id)!=0){
					buff.append("',expanded:true,children:["
							+ "{id:'"
							+ departmentService.get(Long.valueOf(id))
									.getDepId()
							+ "',text:'"
							+ departmentService.get(Long.valueOf(id))
									.getDepName());
					}
				}
				for(String id:arrayList){
					if(Long.valueOf(id)==0){
						String st=findChild(ContextUtil.getCurrentUser().getDepartment().getDepId());
						if(st==null||st.equals("leaf:true},")){
						buff.append("',leaf:true}]");
						}else{
							buff.append("',");
							buff.append(st);
							buff.deleteCharAt(buff.length()-1);
							buff.append("]");
						}
					}
					else{
					buff.append("}]");
					}
					}
				

			
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/**
	 * 
	 * 判断当前用户的部门级别
	 * @return
	 */
	public String depLevelValid(){
		String curdepId=getRequest().getParameter("curdepId");
		if(StringUtils.isNotEmpty(curdepId)){
			if(curdepId.toString().equals("0")){
				 jsonString = "{success:false}";
			}else{
				 Department curdepartment=departmentService.get(new Long(curdepId));
				 if(curdepartment.getDepLevel()>ContextUtil.getCurrentUser().getDepartment().getDepLevel()){
					 jsonString = "{success:true}";
				 }else{
					 jsonString = "{success:false}";
				 }
			}
		} 
		return SUCCESS;
	}
	/**
	 * 
	 * @return
	 */
	public String findByUserDepId(){
		AppUser appuser = ContextUtil.getCurrentUser();
		StringBuffer buff = new StringBuffer();
		List<Department> listParent = null;
//		buff.append("[");
		if(1==ContextUtil.getCurrentUserId()){
			buff.append("[{id:'"+0+"',text:'"+AppUtil.getCompanyName()+"',expanded:true,children:[");
			listParent=departmentService.findByParentId(new Long(0));
		}else{
			Long userDepId = appuser.getDepartment().getDepId();
			String userDepName = appuser.getDepartment().getDepName();
			buff.append("[{id:'"+userDepId+"',text:'"+userDepName+"',expanded:true,children:[");
			listParent=departmentService.findByParentId(userDepId);
		}
		for(Department dep:listParent){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
			buff.append(findChild(dep.getDepId()));
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		buff.append("]}]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/**
	 * 根据当前人查找当前人所属第三层一下的所有部门和人员
	 */
//	public String curDepLeadersTree() {
//		String path = ContextUtil.getCurrentUser().getDepartment().getPath();
//		if (path != null && !path.equals("")) {
//			String[] pt = path.split("\\.");
//			if (pt.length >= 3) {
//				List<DepartmentL3> depList = new ArrayList<DepartmentL3>();
//				StringBuffer buff = new StringBuffer("[");
//				for(DepartmentL3 dep:depList){
//					String nameLK = getRequest().getParameter("nameLK");
//					String childrenStr = findChild2(dep.getLeaders(),nameLK);
//					
//					 //filter dep children:[]
//					if(!childrenStr.equals("leaf:true") && !childrenStr.equals("children:[]")){
//						buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");	
//						buff.append(childrenStr).append("},");
//					}
//				}
//				
//				String result = buff.toString();
//				if(result.endsWith(",")){
//					result = result.substring(0, buff.toString().length()-1);
//				}
//				setJsonString(result+"]");
//			}
//		}
//		return SUCCESS;
//	}
	  public String curDepLeadersTree()
	  {
	    String path = ContextUtil.getCurrentUser().getDepartment().getPath();
	    if ((path != null) && (!path.equals(""))) {
	      String[] pt = path.split("\\.");
	      if (pt.length >= 3) {
	        List depList = new ArrayList();
	        Department dep = (Department)this.departmentService.get(new Long(pt[2]));
	        StringBuffer buff = new StringBuffer("[");
	        buff.append("{id:'" + dep.getDepId() + "',text:'" + dep.getDepName() + "',");
	        buff.append(findChildDepAppUser(dep.getDepId()));
	        String result = buff.toString();
	        if (result.endsWith(",")) {
	          result = result.substring(0, buff.toString().length() - 1);
	        }
	        setJsonString(result + "]");
	      }
	    }
	    return "success";
	  }
	
	/**
	 * 获取各个委属单位的人员
	 * @author add by liusicen
	 * @return
	 */
	public String depUsersTree(){
		List<Department> dList= new ArrayList<Department>();
		String deps = getRequest().getParameter("depIds");
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_path_S_LK", "."+deps+".");
		filter.addSorted("departmentLevel", "asc");
		filter.getPagingBean().setPageSize(Integer.MAX_VALUE);
		dList = departmentService.getAll(filter);
		String roles = getRequest().getParameter("roles");
		String subDeptId = getRequest().getParameter("subDeptId");//不要某一部门所传参数部门ID
		List<UserDepartment> udList=departmentService.findUserDepartmentTree(deps, roles, subDeptId);

		Department dep = departmentService.get(new Long(deps));
		StringBuffer buff = new StringBuffer("[");
	    buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
		buff.append(findChildDepAppUser2(dep.getDepId(),dList,udList));
		String result = buff.toString();
		if (result.endsWith(",")) {
			result = result.substring(0, buff.toString().length() - 1);
		}
		setJsonString(result+"]");
		return SUCCESS; 
	}
	/**
	 * 寻找部门和相应部门下人员
	 * @param depId
	 * @return
	 */
	public String findChildDepAppUser2(Long depId,List<Department> dList,List<UserDepartment> udList){
		StringBuffer buff1=new StringBuffer("");
		List<Department> list=new ArrayList<Department>();
		for(Department d: dList){
			if(d.getParentId().equals(depId)){
				list.add(d);
			}
		}
		List<AppUser> userlist=new ArrayList<AppUser>();
		for(UserDepartment ud: udList){
			if(ud.getDeptId().equals(depId)){
				AppUser au=new AppUser();
				au.setUserId(ud.getUserId());
				au.setFullname(ud.getUserName());
				userlist.add(au);
			}
		}
		if(list.size()==0&&userlist.size()==0){
			buff1.append("leaf:true},");
			return buff1.toString(); 
		}else {
			buff1.append("children:[");
			if(userlist.size()>0){
				for(AppUser user:userlist){				
					buff1.append("{id:'"+user.getUserId()+"',text:'"+user.getFullname()+"',leaf:true,checked: false},");
				}
			}
			if(list.size()>0){
				for(Department dep2:list){				
					buff1.append("{id:'"+dep2.getDepId()+"',text:'"+dep2.getDepName()+"',");
					buff1.append(findChildDepAppUser2(dep2.getDepId(),dList,udList));
				}
			}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			return buff1.toString();
		}
	}
	/**
	 * 寻找部门和相应部门下人员
	 * @param depId
	 * @return
	 */
	public String findChildDepAppUser(Long depId){
		StringBuffer buff1=new StringBuffer("");
		List<Department> list=departmentService.findByParentId(depId);
		List<AppUser> userlist=appUserService.findByDepId(depId);
		if(list.size()==0&&userlist.size()==0){
			buff1.append("leaf:true},");
			return buff1.toString(); 
		}else {
			buff1.append("children:[");
			if(userlist.size()>0){
				for(AppUser user:userlist){				
					buff1.append("{id:'"+user.getUserId()+"',text:'"+user.getFullname()+"',leaf:true,checked: false},");
				}
			}
			if(list.size()>0){
			for(Department dep2:list){				
				buff1.append("{id:'"+dep2.getDepId()+"',text:'"+dep2.getDepName()+"',");
				buff1.append(findChildDepAppUser(dep2.getDepId()));
			}}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			return buff1.toString();
		}
	}
	/**
	 * 获取当前人员所在Schema下面的所有部门By（H2603045）
	 */
	public String listBySchema(){
		AppUser user = ContextUtil.getCurrentUser();
		String opt=getRequest().getParameter("opt");
		StringBuffer buff = new StringBuffer();
		int innerLimitLevel = Constants.DepartmentLevelLimit.DEFAULT_INNER;
		int externalLimitLevel = Constants.DepartmentLevelLimit.DEFAULT_EXTERNAL;
		if(StringUtils.isNotBlank(getRequest().getParameter("innerLimitLevel")))
			innerLimitLevel = Integer.parseInt(getRequest().getParameter("innerLimitLevel"));
		if(StringUtils.isNotBlank(getRequest().getParameter("externalLimitLevel")))
			externalLimitLevel = Integer.parseInt(getRequest().getParameter("externalLimitLevel"));
//		if(user.getIsAdmin()){
			buff.append("[{id:'"+0+"',text:'"+AppUtil.getCompanyName()+"',expanded:true,children:[");
		/*}else{
			buff.append("[{id:'"+user.getDepartment().getDepId()+"',text:'"+user.getDepartment().getDepName()+"',expanded:true,children:[");
		}*/
		List<Department> listParent;
		/*Long parentId = null;
		if(user.getIsAdmin()){
			parentId = new Long(0);
		}else{
			parentId = user.getDepartment().getDepId();
		}*/
		boolean isAdmin = false;
		if(user.getIsAdmin()) isAdmin = true;
		
			//如果没有传送root参数，默认使用最顶层父节点
//			listParent=departmentService.findByParentId(parentId);//最顶层父节点	
		listParent = departmentService.findByAdmin(new Long(0), isAdmin);
		for(Department dep:listParent){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
		    //buff.append(findChild(dep.getDepId()));         //modify by :tony
			buff.append(findChildByAdmin(dep,innerLimitLevel,externalLimitLevel,isAdmin));
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		if(StringUtils.isNotEmpty(opt)){
		   buff.append("]");
		}else{
			buff.append("]}]");
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	/**
	 *  如果是admin查询所有，若果不是只查IsExternal为0的数据
	 * @param depart
	 * @param innerLimitLevel
	 * @param externalLimitLevel
	 * @return
	 */
	public String findChildByAdmin(Department depart, int innerLimitLevel,
			int externalLimitLevel, boolean isAdmin) {
		StringBuffer buff1 = new StringBuffer("");
		//Department depart=departmentService.get(depId);
		if (null != depart.getIsExternal() && 0 != depart.getIsExternal()
				&& depart.getDepLevel() >= externalLimitLevel) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}
	if (null != depart.getIsExternal() && 0 == depart.getIsExternal()
				&& depart.getDepLevel() >= innerLimitLevel) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}
		List<Department> list = findBySchemaAndParentId(depart.getDepId(),isAdmin);//departmentService.findByParentId(depart.getDepId());

		if (list.size() == 0) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}

		buff1.append("expanded:true,children:[");
		for (Department dep2 : list) {
			buff1.append("{id:'" + dep2.getDepId() + "',text:'"
					+ dep2.getDepName() + "',");
			buff1.append(findChildByAdmin(dep2,innerLimitLevel,externalLimitLevel,isAdmin));
		}
		buff1.deleteCharAt(buff1.length() - 1);
		buff1.append("]},");
		return buff1.toString();

	}
	
	/**
	 * 在缓存中查询部门信息
	 * 解决部门加载缓慢问题
	 * @return by H2603045
	 */
	private List<Department> findBySchemaAndParentId(long depId, boolean isAdmin){
		String schema = null;
		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
			schema = ContextUtil.getCurrentUser().getOwnerSchema();
		List<Department> schemaDepartmentList = null;
		if(null == schemaDepartmentListMap.get(schema)) {
			schemaDepartmentList = departmentService.findNotAll(isAdmin);
			if (schema != null && !"".equals(schema)) {
				schemaDepartmentListMap.put(schema, schemaDepartmentList);
			}
		} else {
			schemaDepartmentList = schemaDepartmentListMap.get(schema);
			if (schemaDepartmentList == null || schemaDepartmentList.size() <= 0) {
				schemaDepartmentList = departmentService.findNotAll(isAdmin);
				if (schema != null && !"".equals(schema)) {
					schemaDepartmentListMap.put(schema, schemaDepartmentList);
				}
			}
		}
//		if(null == schemaDepartmentList)
//			schemaDepartmentList = departmentService.findNotAll(isAdmin);
		List<Department> resultDepartment = new ArrayList<Department>();
		for(Department depart : schemaDepartmentList){
			if(depId  == depart.getParentId()){
				resultDepartment.add(depart);
			}
		}
		schemaDepartmentList.removeAll(resultDepartment);
		return resultDepartment;
	}
	/*外来会议人员选择器*/
	public String findUserByRole(){
		String roles = getRequest().getParameter("roles");
		String nameLK = getRequest().getParameter("nameLK");
		List<AppUser> list=new ArrayList<AppUser>();
/*		List<AppUser> listAppUsers=new ArrayList<AppUser>();
		for (String role : roles.split(",")) {
		List<AppUser> list	= appUserService.findUserByRole(roles, nameLK);
		for (AppUser appUser:list) {
			listAppUsers.add(appUser);
		}
		}*/if(null==roles&&"".equals(roles)){
			list= appUserService.getAll();
		}else{
		list= appUserService.findUserByRole(roles, nameLK);}
		/*去除重复角色*/
		for (int i = 0; i < list.size(); i++)  //外循环是循环的次数
        {
            for (int j = list.size() - 1 ; j > i; j--)  //内循环是 外循环一次比较的次数
            {

                if (list.get(i) == list.get(j))
                {
                	list.remove(j);
                }

            }
        }
		/*HashSet<AppUser> hs = new HashSet<AppUser>(list);*/
		Map<Long, String> depMap=new LinkedMap();
		for (AppUser appuser:list) {
			if(null==depMap.get(appuser.getDepartment().getDepId())){
				depMap.put(appuser.getDepartment().getDepId(), appuser.getDepartment().getDepName());
			}
		}
		StringBuffer buff = new StringBuffer("[");
		Set set = depMap.entrySet();
		Iterator iterator = set.iterator();
		while (iterator.hasNext()) { 
			Map.Entry entry = (Map.Entry) iterator.next();
			Long key = (Long) entry.getKey();
			buff.append("{id:'" + key + "',text:'"
					+ entry.getValue().toString() + "',");
			buff.append(findChild3(list, key)).append("},");
		}
			String result = buff.toString();
			if(result.endsWith(",")){
				result = result.substring(0, buff.toString().length()-1);
			} 
			setJsonString(result+"]");
			
	return SUCCESS;}
	public  String findChild3(List<AppUser> list,Long depId){
		StringBuffer buff1=new StringBuffer("");
		if(list.size()==0){
			buff1.append("leaf:true");
			return buff1.toString(); 
		}else {
			buff1.append("children:[");
			for(AppUser leader:list){
				if (leader.getDepartment().getDepId().compareTo(depId)==0) {
					buff1.append("{id:'"+leader.getUserId()+"',text:'"+leader.getFullname()+"',leaf:true,checked: false},");	
				}
			}
			if(buff1.charAt(buff1.length()-1)==','){
				buff1.deleteCharAt(buff1.length()-1);
			}
			buff1.append("]");
			return buff1.toString();
		}
	}
	/**
	 * 获取当前Schema下的所有内部部门
	 */
	public String innerSentList(){
		AppUser user = ContextUtil.getCurrentUser();
		String opt = getRequest().getParameter("opt");
		StringBuffer buff = new StringBuffer();
		int innerLimitLevel = Constants.DepartmentLevelLimit.DEFAULT_INNER;
		int externalLimitLevel = Constants.DepartmentLevelLimit.DEFAULT_EXTERNAL;
		if(StringUtils.isNotBlank(getRequest().getParameter("innerLimitLevel")))
			innerLimitLevel = Integer.parseInt(getRequest().getParameter("innerLimitLevel"));
		if(StringUtils.isNotBlank(getRequest().getParameter("externalLimitLevel")))	
			externalLimitLevel = Integer.parseInt(getRequest().getParameter("externalLimitLevel"));
		List<Department> listParent;
		Long parentId = null;
		boolean isAdmin=false;
		Department optDep=departmentService.get(new Long(opt));
		if(user.getIsAdmin()){
			buff.append("[{id:'"+0+"',text:'"+AppUtil.getCompanyName()+"',expanded:true,children:[");
			parentId = new Long(0);
			isAdmin=true;
		}else{
			parentId =  new Long(opt);
			Department orgDep=departmentService.get(parentId);
			buff.append("[{id:'"+orgDep.getDepId()+"',text:'"+orgDep.getDepName()+"',expanded:true,children:[");
			
		}
		listParent=departmentService.findByParentId(parentId);//最顶层父节点
		for(Department dep:listParent){
			if((null != dep.getIsExternal() && 0 == dep.getIsExternal())
					|| optDep.getPath().indexOf(dep.getDepId() + "") >= 0){
				buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
				buff.append(findChildByIsternal(dep));
			}
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		buff.append("]}]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/**
	 *  如果是admin查询所有，若果不是只查IsExternal为0的数据
	 * @param depart
	 * @param innerLimitLevel
	 * @param externalLimitLevel
	 * @return
	 */
	public String findChildByIsternal(Department depart) {
		StringBuffer buff1 = new StringBuffer("");
		List<Department> list = findBySchemaAndParentId(depart.getDepId(),false);
		if (list.size() == 0) {
			buff1.append("leaf:true},");
			return buff1.toString();
		}
		buff1.append("expanded:true,children:[");
		for (Department dep2 : list) {
				buff1.append("{id:'" + dep2.getDepId() + "',text:'"
						+ dep2.getDepName() + "',");
				buff1.append(findChildByIsternal(dep2));
		}
		buff1.deleteCharAt(buff1.length() - 1);
		buff1.append("]},");
		return buff1.toString();

	}
	/**
	 * 根据所传最上层部门Id查询所传Id及其下所有部门
	 * by H2603045
	 * @return
	 */
	public String findBySchema(){
		String depId = this.getRequest().getParameter("depId");
		List<Department> depList = departmentService.findChildrenByConfig(new Long(depId));
		StringBuffer buff = new StringBuffer();
		if(depList.size() > 0){
			for(int i = 0; i< depList.size(); i++){
				if((new Long(depId)).equals(depList.get(i).getDepId())){
					buff.append("[{id:'" + depList.get(i).getDepId() + "',text:'" + depList.get(i).getDepName() + "'");
					buff.append(",expanded:true,children:[");
					String buff1 = findDepChildren(new Long(depId), depList);
					buff.append(buff1);
					buff.append("]");
					break;
				}
			}
		}
		buff.append("}]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	private String findDepChildren(Long depId, List<Department> depList){
		StringBuffer buff = new StringBuffer();
		if(depList.size() > 0){
			for(int i = 0; i < depList.size(); i++){
				if(depId.equals(depList.get(i).getParentId())){
					buff.append("{id:'" + depList.get(i).getDepId() + "',text:'" + depList.get(i).getDepName()+"'");
					boolean haveChild = false;
					for(int j = 0 ; j < depList.size(); j++){
						if(depList.get(i).getDepId().equals(depList.get(j).getParentId())){
							buff.append(",expanded:true,children:[");
							String depChild = findDepChildren(depList.get(i).getDepId(), depList);
							buff.append(depChild);
							buff.append("]");
							haveChild = true;
						}
					}
					if(!haveChild) buff.append(",leaf:true");
					buff.append("},");
				}
			}
			if(buff.length()>0) buff.deleteCharAt(buff.length() - 1);
		}
		return buff.toString();
	}
/*	显示本部门*/
	public String findDep(){
		String depId = this.getRequest().getParameter("depId");
		List<Department> depList = departmentService.findChildrenByConfig(new Long(depId));
		Type type=new TypeToken<List<Department>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(depList.size()).append(",result:");
		Gson gson=new Gson();
		buff.append(gson.toJson(depList, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
private static final String leader_roleIds = "100152,1266860,1312872,100175,100156";
	
	/**
	 * 判断用户是否有权限
	 * roleIdsStr 
	 * @param user
	 * @param roleIdsStr 100152,1266860,1312872,100175,100156
	 * 部长/经理100152
	 * 副部长/副经理100156
	 * 开投集团办公室主任1266860
	 * 副主任1312872
	 * 开投集团领导100175
	 * 部门内勤1201163
	 * 内勤管理员1950631
	 * @return
	 */
	public static boolean isUserRole(AppUser user, String roleIdsStr) {
		boolean result = false;
		//查询已有角色
		Set<AppRole> roles = user.getRoles();
		for(AppRole role : roles){
			if(roleIdsStr.contains(String.valueOf(role.getRoleId()))){
				result = true;
				break;
			}
		}
		return result;
	}
	
	/**
	 * 获取部门及部门人员
	 * @author add by liusicen
	 * @return
	 */
	public String getDeptAndUser(){
		String deptId = getRequest().getParameter("deptId");
		String notShowDeptIds = getRequest().getParameter("notShowDeptIds");
		String isOnlyRole = getRequest().getParameter("isOnlyRole");
		String roleIds = getRequest().getParameter("roleIds");
		
		if("1".equals(isOnlyRole)){
			if(StringUtils.isBlank(roleIds)){
				roleIds = leader_roleIds;
			}
		}
		Department dept = departmentService.get(new Long(deptId));
		StringBuffer buff = new StringBuffer("[");
	    buff.append("{id:'"+dept.getDepId()+"',text:'"+dept.getDepName()+"',");
	    buff.append(getChildDeptAndUser(new Long(deptId), notShowDeptIds, roleIds));
//	    buff.append(findChildDepAppUser(new Long(deptId)));

		String result = buff.toString();
		if (result.endsWith(",")) {
			result = result.substring(0, buff.toString().length() - 1);
		}
		setJsonString(result+"]");
		System.out.println(result+"]");
		return SUCCESS; 
	}
	

	private String getChildDeptAndUser(Long deptId,String notShowDeptIds, String roleIds){
		StringBuffer buff1=new StringBuffer("");
		List<Department> list=departmentService.findByParentId(deptId);
		List<AppUser> userlist=appUserService.findByDepId(deptId);
		if(list.size()==0&&userlist.size()==0){
			buff1.append("leaf:true},");
		}else {
			buff1.append("children:[");
			if(userlist.size()>0){
				int count = 0;
				for(AppUser user:userlist){
					boolean isBackUser = false;
					if(StringUtils.isNotBlank(roleIds)){
						if(isUserRole(user, roleIds)){
							isBackUser = true;
						}
					} else {
						isBackUser = true;
					}
					if(isBackUser){
						buff1.append("{id:'"+user.getUserId()+"',text:'"+user.getFullname()+"',leaf:true,checked: false},");
						count++;
					}
				}
				if(count == 0){
					buff1.append("[");
				}
			}
			
			if(list.size()>0){
			for(Department dep2:list){		
				boolean isBackUser = false;
				if(StringUtils.isNotBlank(notShowDeptIds)){
					if(!notShowDeptIds.contains(String.valueOf(dep2.getDepId()))){
						isBackUser = true;
					}
				} else {
					isBackUser = true;
				}
				if(isBackUser){
					if (buff1.toString().endsWith("[[")) {
						buff1=new StringBuffer(buff1.toString().substring(0, buff1.toString().length() - 1));
					}
					buff1.append("{id:'"+dep2.getDepId()+"',text:'"+dep2.getDepName()+"',");
					buff1.append(getChildDeptAndUser(dep2.getDepId(), notShowDeptIds, roleIds));
				}
			}}
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
		}
		System.out.println(buff1.toString());
		return buff1.toString();
	}
}
