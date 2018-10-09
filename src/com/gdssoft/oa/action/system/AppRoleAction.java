package com.gdssoft.oa.action.system;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import org.apache.commons.lang.StringUtils;
import org.dom4j.Document;
import java.lang.reflect.Type;

import com.gdssoft.oa.model.system.AppFunction;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.service.system.AppFunctionService;
import com.gdssoft.oa.service.system.AppRoleService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.web.action.BaseAction;
/**
 * 
 * @author csx
 *
 */
public class AppRoleAction extends BaseAction{
	@Resource
	private AppFunctionService appFunctionService;
	
	private static String IS_COPY="1";
	
	@Resource
	private AppRoleService appRoleService;
	
	private AppRole appRole;
	
	private Long roleId;

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public AppRole getAppRole() {
		return appRole;
	}

	public void setAppRole(AppRole appRole) {
		this.appRole = appRole;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<AppRole> list= appRoleService.getAll(filter);
		
		Type type=new TypeToken<List<AppRole>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
			.append(filter.getPagingBean().getTotalItems()).append(",result:");
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 列出角色树
	 * 
	 */
	public String tree(){
		List<AppRole> listRole;
		StringBuffer buff = new StringBuffer("[");
		listRole=appRoleService.getAll();//最顶层父节点
		for(AppRole role:listRole){
			buff.append("{id:'"+role.getRoleId()+"',text:'"+role.getRoleName()+"',leaf:true},");
		}
		if (!listRole.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	/**
	 * 列出部门中的角色树
	 * 
	 */
	public String treeDepRole(){
		List<AppRole> listRole;
		StringBuffer buff = new StringBuffer("[");
		listRole=appRoleService.getAll();//最顶层父节点
		for(AppRole role:listRole){
			buff.append("{id:'"+role.getRoleId()+"',text:'"+role.getRoleName()+"',leaf:true},");
		}
		if (!listRole.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		buff.append("]");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				AppRole appRole=appRoleService.get(new Long(id));
				appRole.getAppUsers().remove(appRole);
				appRole.getFunctions().remove(appRole);
				appRoleService.remove(appRole);
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 角色授权
	 * @return
	 */
	public String grant(){
		AppRole appRole=appRoleService.get(roleId);
		String rights=getRequest().getParameter("rights");
		
		if(rights==null){
			rights="";
		}
		
		
		appRole.setRights(rights);
		
		appRole.getFunctions().clear();
		
		String[] funs=rights.split("[,]");
		
		for(int i=0;i<funs.length;i++){
			if(funs[i].startsWith("_")){
				AppFunction af=appFunctionService.getByKey(funs[i]);
				if(af!=null){
					appRole.getFunctions().add(af);
				}
			}
		}
		
		//检查Right是否发生了变化
		appRoleService.save(appRole);
		//重新加载权限 TODO 优化为只是更新该角色对应的权限
		AppUtil.reloadSecurityDataSource();
		

		return SUCCESS;
	}
	
	/**
	 * 加载授权的XML
	 * @return
	 */
	public String grantXml(){
		Document grantMenuDoc=AppUtil.getGrantMenuDocument();
		setJsonString(grantMenuDoc.asXML());
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		AppRole appRole=appRoleService.get(roleId);
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(appRole));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 * 当是isCopy='1'时，则是为角色的复制
	 */
	public String save(){
		String isCopy=getRequest().getParameter("isCopy");
		if(StringUtils.isNotEmpty(isCopy)&&IS_COPY.equals(isCopy)){
			AppRole role=new AppRole();
			role.setIsDefaultIn((short)0);
			role.setRoleDesc(appRole.getRoleDesc());
			role.setStatus(appRole.getStatus());
			role.setRoleName(appRole.getRoleName());
			appRole=appRoleService.get(appRole.getRoleId());
			Set<AppFunction> set=new HashSet<AppFunction>(appRole.getFunctions());
			role.setFunctions(set);
			role.setRights(appRole.getRights());
			appRoleService.save(role);
		}else{
			if(appRole.getRoleId()==null){
				appRole.setIsDefaultIn((short)0);
				appRoleService.save(appRole);
			}else{
				AppRole orgRole=appRoleService.get(new Long(appRole.getRoleId()));
				try{
					BeanUtil.copyNotNullProperties(orgRole, appRole);
					appRoleService.save(orgRole);
				}catch(Exception ex){
				}
			}
		}		
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String check(){
		String roleName=getRequest().getParameter("roleName");
		AppRole appRole=appRoleService.getByRoleName(roleName);
		if(appRole==null){
			setJsonString("{success:true}");
		}else{
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}
	
}
