package ma.sir.ged.ws.dto.dashboard;
public class MonthlyDocumentCountDTO {
    private String identifier;
    private int month;
    private long count;

    public MonthlyDocumentCountDTO(String identifier, int month, long count) {
        this.identifier = identifier;
        this.month = month;
        this.count = count;
    }


    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

}
