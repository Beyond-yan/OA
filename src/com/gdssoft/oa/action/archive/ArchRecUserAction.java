package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.archive.ArchRecUser;
import com.gdssoft.oa.model.flow.ProUserAssign;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.archive.ArchRecUserService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author 
 *
 */
public class ArchRecUserAction extends BaseAction{
	@Resource
	private ArchRecUserService archRecUserService;
	private ArchRecUser archRecUser;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private AppUserService appUserService;
	private Long archRecId;

	public Long getArchRecId() {
		return archRecId;
	}

	public void setArchRecId(Long archRecId) {
		this.archRecId = archRecId;
	}

	public ArchRecUser getArchRecUser() {
		return archRecUser;
	}

	public void setArchRecUser(ArchRecUser archRecUser) {
		this.archRecUser = archRecUser;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<ArchRecUser> list= archRecUserService.getAll(filter);
		
		Type type=new TypeToken<List<ArchRecUser>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	public String depList(){
		List<Object[]> list=archRecUserService.findDepAll();
		StringBuffer sb=new StringBuffer("{success:true,'totalCounts':");
		sb.append(list.size()).append(",result:[");
		for(int i=0;i<list.size();i++){
			if(i>0){
				sb.append(",");
			}
			ArchRecUser ar=(ArchRecUser)list.get(i)[0];
			Department dep=(Department)list.get(i)[1];
			sb.append("{'depId':'"+dep.getDepId()+"','depName':'"+dep.getDepName()+"','depLevel':"+dep.getDepLevel()+",");
			if(ar!=null){
			   sb.append("'archRecId':'"+ar.getArchRecId()+"','userId':'"+ar.getUserId()+"','fullname':'"+ar.getFullname()+"'}");
		    }else{
		    	sb.append("'archRecId':'','userId':'','fullname':''}");
		    }
		}
		sb.append("]}");
		jsonString=sb.toString();
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
				archRecUserService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		ArchRecUser archRecUser=archRecUserService.get(archRecId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(archRecUser));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String data=getRequest().getParameter("data");
		if(StringUtils.isNotEmpty(data)){
			Gson gson=new Gson();
			ArchRecUser[]aru=gson.fromJson(data, ArchRecUser[].class);
			for(ArchRecUser archRecUser:aru){
				if(archRecUser.getArchRecId()==-1){//若为-1，则代表尚未持久化,主要用于防止自动绑值出错;
					archRecUser.setArchRecId(null);
				}
				if(archRecUser.getDepId()!=null){
					Department department=departmentService.get(archRecUser.getDepId());
					archRecUser.setDepartment(department);
					archRecUserService.save(archRecUser);
				}else{
					setJsonString("{success:false}");
				}
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String select(){
		String strDepId=getRequest().getParameter("depId");
		StringBuffer sb=new StringBuffer("[");
		if(StringUtils.isNotEmpty(strDepId)){
			List<AppUser> list=appUserService.findByDepId(new Long(strDepId));
		    for(AppUser appUser:list){
		    		sb.append("['").append(appUser.getUserId()).append("','").append(appUser.getFullname()).append("'],");	
		    }
		    if(list.size()>0){
				sb.deleteCharAt(sb.length()-1);
			}
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
}
