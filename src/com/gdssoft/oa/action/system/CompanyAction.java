package com.gdssoft.oa.action.system;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.system.Company;
import com.gdssoft.oa.service.system.CompanyService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.gdssoft.core.Constants;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.web.action.BaseAction;


public class CompanyAction extends BaseAction{

	private Company company;

	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}
	
	@Resource
	private CompanyService companyService;
	

	public String check(){
		List<Company> list = companyService.findCompany();
		if(list.size()>0){
			setJsonString("{success:true}");
		}else{
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}
	
	public String list(){
		List<Company> list = companyService.findCompany();
		if(list.size()>0){
			company = list.get(0);
			Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			StringBuffer cf = new StringBuffer("{success:true,result:[");
			cf.append(gson.toJson(company));
			cf.append("]}");
			setJsonString(cf.toString());
		}else{
			setJsonString("{success:false,message:'还没有填写公司信息'}");
			return SUCCESS;			
		}		
		return SUCCESS;

	}

	public String add(){
		companyService.save(company);
		Map map=AppUtil.getSysConfig();
		map.remove(Constants.COMPANY_LOGO);
		map.remove(Constants.COMPANY_NAME);
		map.put(Constants.COMPANY_LOGO,company.getLogo());
		map.put(Constants.COMPANY_NAME,company.getCompanyName());
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String delphoto(){
		List<Company> list = companyService.findCompany();
		if(list.size()>0){
			company = list.get(0);
			company.setLogo("");
			companyService.save(company);
		}
		return SUCCESS;
	}

}
