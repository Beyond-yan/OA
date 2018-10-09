package com.gdssoft.oa.action.archive;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.oa.model.archive.ArchTemplate;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.archive.ArchTemplateService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;









import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class ArchTemplateAction extends BaseAction{
	@Resource
	private ArchTemplateService archTemplateService;
	@Resource
	private DepartmentService departmentService;
	private ArchTemplate archTemplate;
	
	private Long templateId;

	public Long getTemplateId() {
		return templateId;
	}

	public void setTemplateId(Long templateId) {
		this.templateId = templateId;
	}

	public ArchTemplate getArchTemplate() {
		return archTemplate;
	}

	public void setArchTemplate(ArchTemplate archTemplate) {
		this.archTemplate = archTemplate;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		AppUser appUser= ContextUtil.getCurrentUser();
		Department dep=departmentService.get3LevelDept2(appUser.getDepartment());
		filter.addFilter("Q_department.depId_L_EQ", dep.getDepId()+"");
		List<ArchTemplate> list=archTemplateService.getAll(filter);
		
		JSONSerializer jsonSerializer=JsonUtil.getJSONSerializer();
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		buff.append(jsonSerializer.serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
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
				archTemplateService.remove(new Long(id));
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
		ArchTemplate archTemplate=archTemplateService.get(templateId);
		
		JSONSerializer jsonSerializer=JsonUtil.getJSONSerializer();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(jsonSerializer.serialize(archTemplate));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(archTemplate.getTemplateId()==null){
			AppUser appUser= ContextUtil.getCurrentUser();
			QueryFilter filter=new QueryFilter(getRequest());
			Department dep=departmentService.get3LevelDept2(appUser.getDepartment());
			filter.addFilter("Q_department.depId_L_EQ", dep.getDepId()+"");
			filter.addFilter("Q_isGenre_L_EQ",archTemplate.getIsGenre()+"");
			List<ArchTemplate> list=archTemplateService.getAll(filter);
			if(list.size()>0){
				archTemplate.setPassword(list.get(0).getPassword());
			}else{
				archTemplate.setPassword("123456");
			}
			archTemplate.setAppUser(appUser);
			archTemplate.setUserName(appUser.getFamilyName());
			archTemplate.setDepartment(dep);
			archTemplate.setDepName(dep.getDepName());
			archTemplateService.save(archTemplate);
		}else{
			ArchTemplate template =archTemplateService.get(archTemplate.getTemplateId());
			template.setTempName(archTemplate.getTempName());
			template.setTempPath(archTemplate.getTempPath());
			archTemplateService.save(template);
		}
		
		setJsonString("{success:true}");
		return SUCCESS;
	}
	/**
	 * 修改密码
	 */
	public String updatePassword(){
		AppUser appUser= ContextUtil.getCurrentUser();
		String password=getRequest().getParameter("password");
		String OLDpassword=getRequest().getParameter("OLDpassword");
		QueryFilter filter=new QueryFilter(getRequest());
		Department dep=departmentService.get3LevelDept2(appUser.getDepartment());
		filter.addFilter("Q_department.depId_L_EQ", dep.getDepId()+"");
		List<ArchTemplate> list=archTemplateService.getAll(filter);
		StringBuffer buff = new StringBuffer();
		if(list.size()>0){
			if(OLDpassword.equals(list.get(0).getPassword())){
				for(ArchTemplate temp:list){
					temp.setPassword(password);
					archTemplateService.save(temp);
				}
				buff.append("{\"success\":\"true\",\"msg\":\"修改成功！！！\"}");
				jsonString = buff.toString();
				return SUCCESS;
			}else{
				buff.append("{\"success\":\"false\",\"msg\":\"密码错误\"}");
			}
		}else{
			buff.append("{\"success\":\"false\",\"msg\":\"请联系管理员\"}");
		}
		jsonString = buff.toString();
		return SUCCESS;
	}
	/**
	 * 修改密码
	 */
	public String comparePassword(){
		String password=getRequest().getParameter("password");
		String ntkoSealPath=getRequest().getParameter("ntkoSealPath");
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_tempPath_S_EQ", ntkoSealPath);
		filter.addFilter("Q_password_S_EQ", password);
		List<ArchTemplate> list=archTemplateService.getAll(filter);
		StringBuffer buff = new StringBuffer();
		if(list.size()>0){
			buff.append("{\"success\":\"true\",\"msg\":\"成功\"}");
		}else{
			buff.append("{\"success\":\"false\",\"msg\":\"密码错误\"}");
		}
		jsonString = buff.toString();
		return SUCCESS;
	}
	/**
	 * 套红头模板下拉框
	 */
	public String combo(){
		QueryFilter filter=new QueryFilter(getRequest());
		AppUser appUser= ContextUtil.getCurrentUser();
		Department dep=departmentService.get3LevelDept2(appUser.getDepartment());
		filter.addFilter("Q_department.depId_L_EQ", dep.getDepId()+"");
		List<ArchTemplate> list= archTemplateService.getAll(filter);
		StringBuffer buff = new StringBuffer();
		buff.append("[");
		for (ArchTemplate archTemplate : list) {
			buff.append("['").append(archTemplate.getTemplateId()).append("','")
					.append(archTemplate.getTempName()).append("','")
					.append(archTemplate.getTempPath())
					.append("'],");
		}
		if (list.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		setJsonString(buff.toString());
		jsonString=buff.toString();
		return SUCCESS;
	}
}
