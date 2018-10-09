package com.gdssoft.oa.action.admin;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.admin.Regulation;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.GlobalType;
import com.gdssoft.oa.service.admin.RegulationService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;

import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class RegulationAction extends BaseAction{
	@Resource
	private RegulationService regulationService;
	@Resource
	private FileAttachService fileAttachService;
	private Regulation regulation;
	
	private Long regId;

	public Long getRegId() {
		return regId;
	}

	public void setRegId(Long regId) {
		this.regId = regId;
	}

	public Regulation getRegulation() {
		return regulation;
	}

	public void setRegulation(Regulation regulation) {
		this.regulation = regulation;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<Regulation> list= regulationService.getAll(filter);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		JSONSerializer json=JsonUtil.getJSONSerializer("issueDate");
		buff.append(json.exclude(new String[]{"content"}).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 显示列表
	 */
	public String scan(){
		AppUser curUser = ContextUtil.getCurrentUser();
		Department dep = curUser.getDepartment();
		
		QueryFilter filter=new QueryFilter(getRequest());
		filter.setFilterName("GetRegulationWithRights");
		
		filter.addParamValue(Regulation.STATUS_EFFECT);
		if(dep !=null){
			filter.addParamValue("%,"+curUser.getDepartment().getDepId()+",%");
		}else{
			filter.addParamValue("%,0,%");
		}
		
		filter.addParamValue("%,"+ContextUtil.getCurrentUserId()+",%");
		
		List<Regulation> list= regulationService.getAll(filter);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		JSONSerializer json=JsonUtil.getJSONSerializer("issueDate");
		buff.append(json.exclude(new String[]{"content"}).serialize(list));
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
				regulationService.remove(new Long(id));
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
		Regulation regulation=regulationService.get(regId);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(regulation));
		
		GlobalType proType = regulation.getGlobalType();
		if(proType !=null){
			sb.deleteCharAt(sb.length()-1);
			sb.append(",proTypeId:")
			  .append(proType.getProTypeId())
			  .append(",proTypeName:'")
			  .append(proType.getTypeName())
			  .append("'}");
		}
		
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String fileIds = getRequest().getParameter("regAttachsFileIds");
		
		Set<FileAttach> regAttachs = new HashSet<FileAttach>();
		
		if(StringUtils.isNotEmpty(fileIds)){
			String[]fIds=fileIds.split(",");
			for(int i=0;i<fIds.length;i++){
				FileAttach fileAttach=fileAttachService.get(new Long(fIds[i]));
				regAttachs.add(fileAttach);
			}
		}
		
		//重构部门IDS字符串,变成 如",1,4,3,"这样的字符串,权限时用到
		String depIds = regulation.getRecDepIds();
		if(StringUtils.isNotEmpty(depIds)){
			String[] dIds = depIds.split(",");
			StringBuffer newDepIds = new StringBuffer(",");
			for(String did :dIds){
				newDepIds.append(did).append(",");
			}
			regulation.setRecDepIds(newDepIds.toString());
		}
		//重构部门IDS字符串,变成 如",1,4,3,"这样的字符串,权限时用到
		String userIds = regulation.getRecUserIds();
		if(StringUtils.isNotEmpty(userIds)){
			String[] uIds = userIds.split(",");
			StringBuffer newUserIds = new StringBuffer(",");
			for(String uid :uIds){
				newUserIds.append(uid).append(",");
			}
			regulation.setRecUserIds(newUserIds.toString());
		}
		
		if(regulation.getRegId()==null){
			regulation.setRegAttachs(regAttachs);
			regulationService.save(regulation);
		}else{
			Regulation orgRegulation=regulationService.get(regulation.getRegId());
			try{
				BeanUtil.copyNotNullProperties(orgRegulation, regulation);
				orgRegulation.setRegAttachs(regAttachs);
				regulationService.save(orgRegulation);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
